import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { lastValueFrom, Observable } from "rxjs";
import {
  JobData,
  useServerJobData,
} from "src/core/ssr/serverSideJobs/JobsProvider";
import { mapValuesAsync } from "src/core/utilities";

export type ServerSideJob<D> = (
  context: GetServerSidePropsContext
) => Observable<D>;

type CreateGetServerSidePropsWithJobResult<
  Input extends { [key: string]: ServerSideJob<any> },
  Keys extends keyof Input & string = keyof Input & string
> = GetServerSideProps & {
  [P in Keys as `use${Capitalize<P>}`]: () => Input[P] extends ServerSideJob<
    infer D
  >
    ? JobData<D>
    : JobData;
};

export default function createGetServerSidePropsWithJob<
  Input extends { [key: string]: ServerSideJob<any> }
>(
  inputs: Input,
  getServerPropsInput?: GetServerSideProps
): CreateGetServerSidePropsWithJobResult<Input> {
  const getServerProps: GetServerSideProps = async function (context) {
    if (typeof window === "undefined") {
      return { props: {} };
    }

    const serverProps = getServerPropsInput
      ? await getServerPropsInput(context)
      : undefined;

    if (serverProps && !("props" in serverProps)) {
      return serverProps;
    }

    return {
      props: {
        ...(serverProps && "props" in serverProps ? serverProps.props : {}),
        jobsData: await mapValuesAsync(inputs, async (job) => {
          return lastValueFrom(job(context))
            .then((data) => {
              return {
                data,
              };
            })
            .catch((error) => {
              return { data: null, error: error.toString() };
            });
        }),
      },
    };
  };

  const hooks: any = {};

  for (const key in inputs) {
    if (Object.prototype.hasOwnProperty.call(inputs, key)) {
      const k = "use" + (key[0].toUpperCase() + key.slice(1));
      hooks[k] = function () {
        return useServerJobData(key);
      };
    }
  }

  return Object.assign(getServerProps, { ...hooks });
}

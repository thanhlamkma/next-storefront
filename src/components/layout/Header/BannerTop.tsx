import Image from "next/image";
import * as React from "react";
import { catchError, map, of } from "rxjs";
import Images from "src/assets/images";
import Container from "src/components/Container";
import { useJob } from "src/core/hooks";
import { GetListBannerResponse } from "src/models/Banner";
import BannerRepository from "src/repositories/BannerRepository";

interface Props {}

const BannerTop = (props: Props) => {
  const [banner, setBanner] = React.useState<string>("");
  const { run: getBannerApi } = useJob(() => {
    return BannerRepository.get().pipe(
      map(({ data }: { data: GetListBannerResponse }) => {
        data.data.map((item) => {
          if (item.position === 0) setBanner(item.content);
        });
      }),
      catchError((err) => {
        console.log("get banner err", err);
        return of(err);
      })
    );
  });

  React.useEffect(() => {
    getBannerApi();
  }, []);

  return (
    // <div className="banner-top">
    //   <Container className="flex justify-center items-center">
    //     <Image
    //       src={Images.banner.bannerTop}
    //       width={1188}
    //       height={80}
    //       objectFit="contain"
    //     />
    //   </Container>
    // </div>
    <div dangerouslySetInnerHTML={{ __html: banner }}></div>
  );
};

export default BannerTop;

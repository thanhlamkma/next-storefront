import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPageContext,
} from "next";
import { ComponentType, ReactElement } from "react";

declare global {
  type PageComponent<
    P = {},
    IP = {},
    C extends BaseContext = NextPageContext
  > = ComponentType<P> & {
    /**
     * Used for initial page load data population. Data returned from `getInitialProps` is serialized when server rendered.
     * Make sure to return plain `Object` without using `Date`, `Map`, `Set`.
     * @param ctx Context of `page`
     */
    getInitialProps?(context: C): IP | Promise<IP>;
    getServerSideProps?: GetServerSideProps;
    getStaticProps?: GetStaticProps;
    getStaticPaths?: GetStaticPaths;
    getLayout?: (page: ReactElement) => ReactElement;
  };
}

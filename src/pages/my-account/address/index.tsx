import { Spin } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlinePlus } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { catchError, lastValueFrom, map, of } from "rxjs";
import LayoutAccount from "src/components//layout/LayoutAccount";
import ComponentAddress from "src/components/address/ComponentAddress";
import Layout from "src/components/layout";
import { useJob, useMount } from "src/core/hooks";
import { getServerSidePropsWithApi } from "src/core/ssr";
// import { Address, addresses as addressesData } from "src/data/address";
import { Address, GetListAddressResponse } from "src/models/Partner";
import PartnerRepository from "src/repositories/PartnerRepository";
import toast from "src/services/toast";

export const getServerSideProps: GetServerSideProps = getServerSidePropsWithApi(
  async (context) => {
    const { locale } = context;

    const session = await getSession(context);

    let propsData = {
      listAddressApi: {},
      hasError: false,
    };

    try {
      const { data: dataAdressReponse } = await lastValueFrom(
        PartnerRepository.getListAddress({})
      );

      propsData = {
        ...propsData,
        listAddressApi: dataAdressReponse,
      };
    } catch (error) {
      propsData = {
        ...propsData,
        hasError: true,
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(locale ? locale : "vi")),
        ...propsData,
      },
    };
  }
);

interface AddressProps {
  listAddressApi: GetListAddressResponse;
  hasError: boolean;
}

const Address: PageComponent<AddressProps> = ({ listAddressApi, hasError }) => {
  const [addresses, setAddresses] = useState<Array<Address> | []>(
    listAddressApi.data
  );
  const [addressIds, setAddressIds] = useState<Array<number>>(() => {
    var addrIds: number[] = [];
    listAddressApi.data.map((item) => addrIds.push(item.id));
    return addrIds;
  });
  const [infinite, setInfinite] = useState({
    total: listAddressApi.total,
    currentPage: listAddressApi.pageIndex,
    pageSize: listAddressApi.pageSize,
    hasMore: true,
  });

  const { t } = useTranslation();

  // Call API
  const { run: getListAddressApi } = useJob((addPageIndex: number) => {
    return PartnerRepository.getListAddress({
      PageIndex: infinite.currentPage + addPageIndex,
      PageSize: infinite.pageSize,
    }).pipe(
      map(({ data }: { data: GetListAddressResponse }) => {
        setInfinite((old) => ({
          ...old,
          total: data.total,
          currentPage: data.pageIndex,
          pageSize: data.pageSize,
        }));
        if (addPageIndex === 1) setAddresses((old) => [...old, ...data.data]);
        else setAddresses([...data.data]);
      })
    );
  });

  const { run: deleteAddressApi } = useJob((addressId: number) => {
    return PartnerRepository.delete(addressId).pipe(
      map((data) => {
        console.log("delete success", data.data);
        if (data.data) {
          var addrIds = addressIds;
          setAddressIds(addrIds.filter((item) => item !== addressId));
          toast.show("success", t("accountAddress:deleteSuccess"));
        } else toast.show("error", t("accountAddress:deleteFail"));
      }),
      catchError((err) => {
        console.log("delete err", err);
        return of(err);
      })
    );
  });

  useMount(() => {
    if (hasError) {
      toast.show("error", t("common:errorApi"));
    }
  });

  const fetchMoreData = useCallback(() => {
    if (infinite.total <= infinite.currentPage * infinite.pageSize) {
      setInfinite((old) => ({ ...old, hasMore: false }));
      return;
    }
    getListAddressApi(1);
  }, [infinite]);

  // Handle delete address
  const handleDelete = useCallback((addressId: number) => {
    deleteAddressApi(addressId);
  }, []);

  useEffect(() => {
    getListAddressApi(0);
  }, [addressIds]);

  return (
    <>
      <Head>
        <title>{t("accountAddress:accountAddress")}</title>
      </Head>
      <div id="address" className="mb-5">
        <Link href="/my-account/address/update-address">
          <div className="address-add py-3">
            <AiOutlinePlus className="inline mr-2" />
            {t("accountAddress:addNewAddress")}
          </div>
        </Link>
        {addresses && addresses.length > 0 ? (
          <div
            id="scrollableDiv"
            style={{
              height: 620,
              overflowY: "auto",
              overscrollBehavior: "contain",
            }}
          >
            <InfiniteScroll
              dataLength={addresses.length}
              next={fetchMoreData}
              hasMore={infinite.hasMore}
              loader={
                <div className="flex items-center justify-center">
                  <Spin size="small" />
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              {addresses.map((item: Address) => (
                <ComponentAddress
                  key={item.id}
                  isDefault={item.isDefault}
                  onDelete={() => handleDelete(item.id)}
                  {...item}
                />
              ))}
            </InfiniteScroll>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center py-6">
            <div className="mb-4 text-2xl">
              {t("accountAddress:youDontHaveAddress")}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

Address.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default Address;

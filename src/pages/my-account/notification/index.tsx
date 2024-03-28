import { Card, Dropdown, Menu } from "antd";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { FiClock, FiGift, FiHome } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Button } from "src/components";
import LayoutAccount from "src/components//layout/LayoutAccount";
import Layout from "src/components/layout";
import CardNotification from "src/components/notification/CardNotification";
import {
  Notification,
  notifications as notificationsData,
} from "src/data/notifications";
interface Tab {
  key: "all" | "promotion" | "order" | "system";
  tab: ReactNode;
}

const tabList: Array<Tab> = [
  { key: "all", tab: <FiHome className="icon-card" /> },
  { key: "promotion", tab: <FiGift className="icon-card" /> },
  {
    key: "order",
    tab: <BsReverseLayoutTextSidebarReverse className="icon-card" />,
  },
  { key: "system", tab: <FiClock className="icon-card" /> },
];

interface TabBarExtraProps {}

interface NotificationProps {}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  const session = await getSession(context);

  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "vi")),
    },
  };
};

const TabBarExtra = (props: TabBarExtraProps) => {
  const { t } = useTranslation();
  const menu = useMemo(() => {
    return (
      <Menu className="py-2">
        <Menu.Item className="text-black-33 p-2">
          {t("notification:maskAllRead")}
        </Menu.Item>
        <Menu.Item className="text-black-33 p-2">
          {t("notification:clearAll")}
        </Menu.Item>
      </Menu>
    );
  }, []);

  return (
    <Dropdown trigger={["click"]} overlay={menu} placement="bottomRight">
      <HiOutlineDotsVertical className="icon-card cursor-pointer"></HiOutlineDotsVertical>
    </Dropdown>
  );
};

const Notification: PageComponent = (props: NotificationProps) => {
  const [activeTab, setActiveTab] = useState<Tab>(tabList[0]);
  const [notifications, setNotifications] = useState<Array<Notification> | []>(
    notificationsData
  );
  const { t } = useTranslation();

  const onTabChange = useCallback(
    (key: string) => {
      const tabActive = tabList.find((item) => item.key === key);
      if (tabActive) {
        if (tabActive.key === "promotion") {
          setNotifications([]);
        } else {
          setNotifications(notificationsData);
        }
        setActiveTab(tabActive);
      }
    },
    [tabList]
  );

  return (
    <div id="notification">
      <Card
        style={{ width: "100%" }}
        tabList={tabList}
        activeTabKey={activeTab.key}
        tabBarExtraContent={<TabBarExtra />}
        onTabChange={(key: any) => {
          onTabChange(key);
        }}
      >
        <div className="list-notification">
          {notifications && notifications.length > 0 ? (
            notifications.map((noti: Notification) => (
              <CardNotification key={`${noti.id}-${noti.time}`} {...noti} />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center py-6">
              <div className="mb-4 text-2xl">
                {t("notification:notHaveNotifications")}
              </div>
              <Button>{t("common:cotinueShopping")}</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

Notification.getLayout = (page) => {
  return (
    <Layout>
      <LayoutAccount>{page}</LayoutAccount>
    </Layout>
  );
};

export default Notification;

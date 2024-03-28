export interface Notification {
  id: string | number;
  time: string;
  content: string;
  linkContent: string;
}

export const notifications: Array<Notification> = [
  {
    id: 1,
    time: "19/03/2021",
    content:
      "Đơn hàng #424021047 đã sẵn sàng để giao đến quý khách. Chúng tôi vừa bàn giao đơn hàng của quý khách đến đối tác vận chuyển Shop Team. Đơn hàng sẽ được giao trước 23:59 ngày 19/03/2021",
    linkContent: "#",
  },
  {
    id: 2,
    time: "17/03/2021",
    content:
      "Đơn hàng #460024103 đã sẵn sàng để giao đến quý khách. Chúng tôi vừa bàn giao đơn hàng của quý khách đến đối tác vận chuyển Shop Team. Đơn hàng sẽ được giao trước 23:59 ngày 17/03/2021",
    linkContent: "#",
  },
  {
    id: 3,
    time: "28/01/2021",
    content:
      "Đơn hàng #213239113 đã sẵn sàng để giao đến quý khách. Chúng tôi vừa bàn giao đơn hàng của quý khách đến đối tác vận chuyển Shop Team. Đơn hàng sẽ được giao trước 23:59 ngày 28/01/2021",
    linkContent: "#",
  },
  {
    id: 4,
    time: "26/01/2021",
    content:
      "Shop đã liên hệ Quý khách để giao đơn hàng 213239113 nhưng không thành công. Vui lòng liên hệ hotline 19006035 để được hỗ trợ thông tin giao hàng",
    linkContent: "#",
  },
  {
    id: 4,
    time: "26/01/2021",
    content:
      "Đơn hàng #213239113 đã sẵn sàng để giao đến quý khách. Chúng tôi vừa bàn giao đơn hàng của quý khách đến đối tác vận chuyển Shop Team. Đơn hàng sẽ được giao trước 23:59 ngày 26/01/2021 ",
    linkContent: "#",
  },
];

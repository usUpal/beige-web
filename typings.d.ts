export { };
declare global {
  interface ChatRoomTypes {
    order_id: OrderID;
    id: string;
  }

  interface OrderID {
    assigned_cp: null;
    content_verticals: any[];
    ordered_by: string;
    shoot_datetimes: ShootDatetime[];
    order_status: string;
    content_type: string;
    vst: string;
    location: string;
    budget_range: string;
    description: string;
    shoot_duration: string;
    id: string;
  }

  interface ShootDatetime {
    _id: string;
    start_date_time: Date;
    end_date_time: Date;
    date_status: string;
  }

  interface MessageTypes {
    status: string;
    chat_room_id: string;
    message: string;
    sent_by: SentBy;
    id: string;
  }

  interface SentBy {
    role: string;
    isEmailVerified: boolean;
    name: string;
    email: string;
    id: string;
  }

  interface SocketMessage {
    message: string;
    messageId: string;
    senderId: string;
    senderName: string;
    success: boolean;
  }

  type MessageTypingProps = {
    userName: string;
    userId: string;
  };
  interface OrderType {
    name: string;
    client_id: string;
    cp_id: string;
    content_verticals: string[];
    shoot_datetimes: ShootDatetime[];
    order_status: string;
    content_type: string;
    vst: string;
    location: string;
    budget_range: string;
    description: string;
    shoot_duration: string;
    file_path: string;
  }

  interface ShootDatetimeTypes {
    _id: string;
    shoot_date_time: Date;
    date_status: string;
  }

  interface ShootDatetimeType {
    _id: string;
    shoot_date_time: Date;
    date_status: string;
  }

  interface OrderType {
    cp_id: string;
    chat_room_id: string;
    order_status: string;
    content_verticals: string[];
    vst: string[];
    order_name: string;
    client_id: string;
    shoot_datetimes: ShootDatetime[];
    content_type: string;
    location: string;
    budget_range: string;
    description: string;
    shoot_duration: string;
    payment_ids: string;
    id: string;
  }
  // Generated by https://quicktype.io

  interface ShootTypes {
    budget: Budget;
    chat_room_id: string;
    client_id: string;
    content_type: string[];
    content_vertical: string;
    cp_id: string;
    description: string;
    id: string;
    location: string;
    meeting_date_times: any[];
    order_name: string;
    order_status: string;
    references: string;
    shoot_datetimes: ShootDatetime[];
    shoot_duration: string;
    vst: string[];
  }

  interface Budget {
    max: number;
    min: number;
  }

  interface ShootDatetime {
    _id: string;
    date_status: string;
    start_date_time: Date;
    end_date_time: Date;
  } // Generated by https://quicktype.io

  interface MeetingResponsTypes {
    client: Client;
    cp: Client;
    id: string;
    meeting_date_time: string;
    meeting_status: string;
    meeting_type: string;
    order: Client;
  }

  interface Client {
    id: string;
    name: string;
  }

  interface addonTypes {
    _id: string;
    title: string;
    rate: number;
    ExtendRate: number;
    ExtendRateType: string;
    status: boolean;
    category: string;
    info: string
  }
}

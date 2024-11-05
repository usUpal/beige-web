export {};
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
    ExtendRateType: number;
    status: string;
    category: string;
    info: string;
    hours: number;
  }
  // interface addonTypes {
  //   _id: string;
  //   title: string;
  //   rate: number;
  //   ExtendRate: number;
  //   status: string;
  //   // Add other fields as necessary
  // }

  interface UpdatedAddonRates {
    [key: string]: number;
  }

  interface OrderInfo {
    id: number;
    costingsTitle: string;
    indicator: number;
    price: number;
  }

  interface Payouts {
    id: string;
    date: string;
    status: string;
    accountType: string;
    accountHolder: string;
    expireDate: string;
    cardNumber: number;
    cvc: number;
    userId: number;
    withdrawAmount: number;
    createdAt: string;
    updatedAt: string;
    bankName: string;
    branchName: string;
    phoneNumber: number;
    accountNumber: number;
  }

  interface profileFormData {
    name: string;
    profession: string;
    location: string;
    geo_location: object;
    email: string;
  }

  interface userData {
    createdAt: string;
    email: string;
    id: string;
    isEmailVerified: boolean;
    location: string;
    name: string;
    role: string;
    updatedAt: string;
  }

  // types.ts
  interface GeoLocation {
    coordinates: [number, number];
    type: 'Point';
  }

  interface PlacesAutocompleteProps {
    onAddressSelect?: (address: string) => void;
    handleAddressChange?: (address: string) => void;
    defaultValue?: string;
  }

  interface MapProps {
    setGeo_location: (location: GeoLocation) => void;
    defaultValue?: string;
  }
  interface TQueryParam {
    name: string;
    value: boolean | React.Key;
  }

  interface CpDataTypes {
    id: {
      name?: string;
    };
    decision?: string;
    rateFlexibility?: string;
    team_player?: string;
    experience_with_post_production_edit?: string;
    travel_to_distant_shoots?: string;
    own_transportation_method?: string;
    customer_service_skills_experience?: string;
    trust_score?: number;

    successful_beige_shoots?: number;
    average_rating?: number;
    total_earnings?: number;
    avg_response_time?: number;
    avg_response_time_to_new_shoot_inquiry?: number;
    num_declined_shoots?: number;
    num_accepted_shoots?: number;
    date_of_birth?: Date;
    review_status?: string;

    reference: ?string;
    rate?: number;
    handle_co_worker_conflicts?: string;
    initiative?: string;
    additional_info?: string;
    timezone?: string;
    city?: string;
    neighborhood?: string;
    zip_code?: string;
    inWorkPressure?: string;

    equipment?: string[];
    equipment_specific?: string[];
    backup_footage?: string[];
    vst?: string[];
    shoot_availability?: string[];
    portfolio?: string[];
    content_verticals?: string[];
    content_type?: string[];
  }

  interface FilePath {
    status: boolean;
    url?: string;
    dir_name?: string;
  }

  interface ShootDatetime {
    start: string;
    end: string;
  }

  interface shootsData {
    addOns: any[];
    budget: {
      min: number;
      max: number;
    };
    chat_room_id: string;
    client_id: string;
    content_type: string[];
    content_vertical: string;
    cp_ids: string[];
    createdAt: string;
    description: string;
    file_path: FilePath;
    geo_location: {
      type: 'Point';
      coordinates: [number, number];
    };
    id: string;
    location: string;
    meeting_date_times: any[];
    order_name: string;
    order_status: 'pending' | 'completed' | 'in_progress' | 'canceled';
    payment: {
      payment_type: 'full' | 'partial';
      payment_status: 'pending' | 'completed' | 'failed';
      amount_paid: number;
      payment_ids: string[];
    };
    references: string;
    review_status: boolean;
    shoot_cost: number;
    shoot_datetimes: ShootDatetime[];
    shoot_duration: number;
    shoot_type: string;
    updatedAt: string;
    vst: any[];
  }
}

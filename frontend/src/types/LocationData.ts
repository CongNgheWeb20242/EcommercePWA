export interface LocationData {
    n: string; // tên
    i: number; // id
    t: string; // loại (Tỉnh, Thành phố, Quận, Huyện,...)
    c?: LocationData[]; // children - danh sách con
}
export type SortType = "featured" | "lowest" | "highest" | "toprated" | "newest";

export const SORT_OPTIONS: { label: string; value: SortType }[] = [
    { label: "Nổi bật", value: "featured" },
    { label: "Giá thấp nhất", value: "lowest" },
    { label: "Giá cao nhất", value: "highest" },
    { label: "Đánh giá cao nhất", value: "toprated" },
    { label: "Mới nhất", value: "newest" },
];
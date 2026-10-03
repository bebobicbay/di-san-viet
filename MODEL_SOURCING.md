# Nguồn mô hình

Ba mô hình Ngọ Môn, Chùa Một Cột, Tháp Rùa được xây dựng bằng hình học thủ tục trong `src/components/monument-model.tsx`. Đây là nghiên cứu hình khối, **không phải bản sao có số đo được kiểm chứng**. Không gán chiều cao thật khi chưa có hồ sơ. Người mẫu dùng đơn vị mét, cao 1.70; chiều cao công trình là null.

Nguồn được chấp nhận cho bản sao: tự dựng Blender từ tài liệu cho phép sử dụng, photogrammetry có phép của đơn vị quản lý, CC0 hoặc CC BY có đầy đủ tác giả/URL/giấy phép. Không dùng tài nguyên không rõ giấy phép. CC BY-SA phải giữ nghĩa vụ chia sẻ tương tự với tài nguyên phái sinh.

Pipeline GLB: dedup, prune, weld, simplify, resize <=1024, meshopt. Chạy `npm run optimize-models -- input.glb output.glb`. CLI optimize xử lý các bước tích hợp; KTX2 cần cài KTX-Software riêng và chạy `gltf-transform etc1s`. Không khẳng định có KTX2 nếu công cụ này chưa chạy.

Cần nghiệm thu thêm trước production: LOD0 <=30k/15k mobile, LOD1/LOD2 riêng, LOD2 <=1MB, AO nướng, instance cây/ngói, đối chiếu kích thước từ nguồn. Hiện không có GLB nên chưa áp dụng Cache API hay prefetch GLB.

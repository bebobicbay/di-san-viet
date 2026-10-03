# DI SẢN VIỆT — Heritage Route Vietnam

Next.js App Router + TypeScript. Giao diện VI/EN, WebGL/R3F, GSAP/Lenis, MapLibre, Howler, Zod, Vitest và Playwright. Đích triển khai: Netlify. Trang chủ, hành trình tương tác tại `/journey`, bản đồ, trang chi tiết và trang nguồn/giấy phép dùng chung một website Next.js. Các dịch vụ dữ liệu ngoài là tùy chọn và chỉ hoạt động khi cấu hình khóa API.

## Chạy tại máy

```sh
npm ci
npm run dev
```

Mở http://localhost:3000. Hành trình tương tác cũng có thể mở trực tiếp tại `/journey?site=den-hung`. Sao chép `.env.example` thành `.env.local` để cấu hình dịch vụ. Không dùng tiền tố `NEXT_PUBLIC_` cho khóa.

```sh
npm test
npm run typecheck
npm run test:smoke
npm run build
```

Smoke tests dùng Edge đã cài trên Windows. Có thể bỏ `channel: 'msedge'` và chạy `npx playwright install chromium` trên CI.

## Dữ liệu và tính trung thực

- 12 điểm di sản, nội dung giới thiệu có URL nguồn và ngày đối chiếu. Các tọa độ là vị trí tham chiếu, không cam kết là cổng vào đã đo đạc.
- Giá ban ngày và lịch 08:00–17:00 của Văn Miếu được đối chiếu trên https://vanmieu.gov.vn/en ngày 2026-10-02. Vé trẻ em miễn phí áp dụng dưới 16 tuổi. Chương trình buổi tối có lịch/giá riêng, chưa tích hợp. Các thông tin chưa xác minh là `null`.
- Không suy ra thứ hạng giá trị lịch sử từ danh hiệu UNESCO. Điểm importance để null đến khi có đánh giá đủ 5 tiêu chí.
- **BestTime 100% là giờ thường lệ đông nhất, không phải sức chứa tối đa**. Không hiển thị “quá tải” nếu không có dữ liệu occupancy độc lập. Chi tiết: https://documentation.besttime.app/app/.
- Ảnh có attribution và giấy phép trong `/credits`, `public/images/attribution.json`. Mô hình tự tạo là minh họa, không phải bản sao đúng tỷ lệ thực. Xem `MODEL_SOURCING.md`.

## Triển khai lên Netlify

1. Đẩy thư mục dự án lên GitHub/GitLab/Bitbucket rồi chọn **Add new site → Import an existing project** trên Netlify.
2. Netlify dùng cấu hình trong `netlify.toml`: `npm run build`, thư mục publish `.next`; adapter Next.js OpenNext hiện được Netlify tự nhận diện.
3. Trong **Site configuration → Environment variables**, thêm `SITE_URL` với URL production. Chỉ thêm khóa API cho dịch vụ bạn muốn bật; các biến máy chủ không cần và không được đặt tiền tố `NEXT_PUBLIC_`.
4. Deploy. Build có bước kiểm tra giới hạn dung lượng assets trước và sau `next build`.

Trang hành trình dùng giao diện độc lập `public/journey.html` bên trong route Next.js `/journey`; chọn di sản cập nhật query trên URL chính. Các ảnh/video tùy chọn cần được đặt đúng đường dẫn trong `public/` như ghi chú dưới đây trong phần `public/images` và `public/videos`.

## Tích hợp máy chủ

- Mapbox Directions: `MAPBOX_SECRET_TOKEN`, hỗ trợ walking/driving. Không coi driving là xe máy; chế độ xe máy giữ trạng thái chưa có dữ liệu.
- Open-Meteo: `OPEN_METEO_API_KEY` dùng customer endpoint phù hợp giấy phép thương mại. Dữ liệu cache 30 phút, hiển thị thời điểm dự báo. AQI chưa tích hợp.
- Google Places: `GOOGLE_PLACES_API_KEY` và `googlePlaceId` đã xác minh trong seed. Không cache dữ liệu Places. Chưa có danh mục nhà hàng.
- BestTime: `BESTTIME_API_KEY_PUBLIC` vẫn chỉ nằm máy chủ; `BESTTIME_VENUES` là JSON ánh xạ slug -> venue ID đã đối chiếu. Cache forecast 7 ngày. Live chỉ bật khi `BESTTIME_ENABLE_LIVE=true`, có private key, cache 1 giờ. Các lượt live có chi phí. Adapter xử lý cửa sổ dữ liệu bắt đầu lúc thứ Hai 06:00. Chưa có venue IDs, mặc định không gọi nhà cung cấp.
- Cache/rate limiter hiện nằm trong bộ nhớ từng tiến trình, **không phải giới hạn phân tán trên Vercel**. Trước vận hành có tải, thay bằng Redis/KV và áp dụng giới hạn tại gateway. Origin gửi định tuyến không được ghi vào cache ứng dụng. Log nền tảng cần chính sách ẩn query tọa độ.

## Việc cần hoàn tất trước khi giới thiệu rộng rãi

- Khóa/dịch vụ thật, venue IDs, Place IDs, xác minh cổng vào, năng lực sức chứa, lịch và phí của 11 điểm còn lại.
- API bổ sung Overpass/Wikidata, nhà hàng Places, Goong xe máy, AQI, thuật toán lịch âm/ngày lễ đã hiệu chuẩn, pipeline gợi ý top 3 với ETA thật. Các hàm scoring/decision đã có unit tests nhưng chưa nối đủ dữ liệu live vào xếp hạng.
- 3 LOD, GLB/KTX2, Cache API, số đo công trình, tự xoay viewer và ngưỡng tam giác trên thiết bị đích; procedural v1 hiện không tải GLB.
- Đo Lighthouse production, FPS thiết bị di động thật, WebGL context loss, kiểm tra WCAG toàn diện. Không suy ra đạt 60fps từ build thành công.
- SEO ngôn ngữ hiện là toggle phía client; URL bản dịch riêng/hreflang chưa triển khai. Trang chi tiết có cả VI/EN, JSON-LD và sitemap.
- Chưa chạy deploy production lên Netlify vì chưa có site/repository được kết nối trong tài khoản. Sau khi publish, kiểm tra trực tiếp API đã cấu hình, map tiles, các đường dẫn ảnh/video và biến môi trường trên domain production.

## Ngân sách

`npm run build` quét public và output, fail file >250 MiB; cảnh báo GLB/audio/JS gzip vượt mục tiêu. Không quét cache build nội bộ. Tổng public không đồng nghĩa initial transfer. Các chunk Three và MapLibre tải động; cần đánh giá riêng tổng JS từng route trong báo cáo mạng.

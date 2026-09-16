# Shopee Profit Dashboard

เว็บ dashboard สำหรับอ่านไฟล์รายได้ Shopee และเก็บ orders/products ใน Cloud Firestore

## การเข้าถึง

เว็บใช้ Google Sign-In และจำกัด Firestore ให้บัญชีเจ้าของที่ยืนยันอีเมลแล้ว

ระบบนำเข้าไฟล์ Excel จะค้นหาชีตและหัวตารางให้อัตโนมัติ จึงรองรับไฟล์ Shopee ที่มีชีต `Summary` อยู่ก่อนชีต `Income` ด้วย ไฟล์ `Income` ใช้ยอดเงินที่โอนแล้วคำนวณกำไร และไม่มีชื่อสินค้าในตัวไฟล์ ดังนั้นให้อัปโหลดไฟล์ `Orders` เพิ่มเพื่อสร้างรายการชื่อสินค้าและต้นทุนในหน้า Cost

ปุ่ม `Export PDF` จะสร้างรายงานจากรายการและตัวกรองปี/เดือนที่กำลังเปิดอยู่

## ตรวจสอบก่อน deploy

```bash
npm test
npx -y firebase-tools@latest deploy --only firestore:rules --project shopee-profit-app
```

GitHub Pages ใช้ `index.html` เป็น static site ส่วน Firebase ใช้ `firebase.json` และ `firestore.rules` เป็น source of truth

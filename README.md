# Shopee Profit Dashboard

เว็บ dashboard สำหรับอ่านไฟล์รายได้ Shopee และเก็บ orders/products ใน Cloud Firestore

## การเข้าถึง

เว็บใช้ Google Sign-In และจำกัด Firestore ให้บัญชีเจ้าของที่ยืนยันอีเมลแล้ว

## ตรวจสอบก่อน deploy

```bash
npm test
npx -y firebase-tools@latest deploy --only firestore:rules --project shopee-profit-app
```

GitHub Pages ใช้ `index.html` เป็น static site ส่วน Firebase ใช้ `firebase.json` และ `firestore.rules` เป็น source of truth

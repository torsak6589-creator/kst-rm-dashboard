# สรุปคำสั่ง Prompt — ชุดแอป KST RM Dashboard

> รวม prompt สำหรับสร้างแอปทั้งหมดใน GitHub (3 แอป) และแอปใหม่ 1 แอปบน Supabase
> (Project: `iqwsfnugjnjrpgjrqsxw` → `https://iqwsfnugjnjrpgjrqsxw.supabase.co`)

| # | แอป | Repo / ไฟล์ | Backend |
|---|-----|-------------|---------|
| 1 | KST-RM UPDATE V2 — แจ้งวัตถุดิบเข้าประจำวัน | `KST-RM-UPDATE-V2/index.html` | SharePoint Excel + Azure Function |
| 2 | KST Procurement Dashboard v17 | `kst-rm-dashboard/kst_rm_v17.html` | SharePoint Excel (Graph API) |
| 3 | KST Collaborative Hub v3 | `kst-rm-dashboard/kst_collab_hub_v3.html` | Firebase Realtime DB |
| 4 | KST RM Hub (ใหม่) | แอปใหม่ | **Supabase** `iqwsfnugjnjrpgjrqsxw` |

---

## Prompt 1 — KST-RM UPDATE V2 (แจ้งวัตถุดิบเข้าประจำวัน)

```
สร้างเว็บแอปไฟล์เดียว index.html ด้วย React 18 + Babel ผ่าน CDN ชื่อ
"แจ้งวัตถุดิบเข้าประจำวัน" สำหรับ KST Hatyai deploy บน GitHub Pages
- Login Microsoft 365 ด้วย MSAL 2.38.3 (PKCE) จำกัดบัญชี @kst-hatyai.com
- ดึงข้อมูลจาก Excel "ADD (5).xlsx" sheet "RM RECORD" บน SharePoint ผ่าน
  Azure Function /api/GetRMData (fallback: อ่านตรงผ่าน Graph + SheetJS, fallback สุดท้าย data.js)
- โครงข้อมูล: { d, bill, type(กุ้งเป็น/กุ้งดอง), species(กุ้งขาว/กุ้งกุลาดำ/กุ้งทะเล),
  size, qty, price, prov, remark } ตรวจหัวคอลัมน์ไทยอัตโนมัติ
- หน้าจอ: การ์ดสรุปรายวัน (ปริมาณ/มูลค่า/ราคาเฉลี่ย) แยกประเภทและชนิด + เลือกเดือน/วันย้อนหลัง
- ธีม navy (#0A0E1A) + ทอง (#C8982A) ฟอนต์ IBM Plex Sans Thai
- Auto-refresh ทุก 5 นาที
(รายละเอียดเต็มดู KST-RM-UPDATE-V2/PROMPT.md)
```

---

## Prompt 2 — KST Procurement Dashboard v17 (`kst_rm_v17.html`)

```
สร้างเว็บแอปไฟล์เดียว kst_rm_v17.html "KST — Procurement Dashboard"
(Vanilla JS + Chart.js 4.4.1 + SheetJS 0.18.5 ผ่าน CDN, MSAL ฝัง inline)
สำหรับวิเคราะห์การจัดซื้อวัตถุดิบกุ้งของ KST Hatyai

1. Auth: ปุ่ม "เชื่อมต่อ Microsoft 365 เพื่อเข้าสู่ระบบ" (OAuth PKCE)
   เก็บ token ใน sessionStorage (kst_at, kst_rt, kst_exp) แสดงอีเมลผู้ใช้ที่ header
2. แหล่งข้อมูล: ไฟล์ Excel "Procurement_Master_File" บน SharePoint
   ลองดึงตามลำดับ: AppSheet sourcedoc → drive+item ID → sharing token (/shares/{token})
3. แท็บทั้งหมด 5 แท็บ:
   - 📦 สรุปการรับซื้อ RM: การ์ด KPI (ปริมาณ กก./ตัน, มูลค่า, ราคาเฉลี่ยถ่วงน้ำหนัก),
     กราฟปริมาณรายวันแยกประเภท, สัดส่วนประเภท, แนวโน้มราคา, Top 10 ผู้ขาย, ตารางรายผู้ขาย
   - 📋 รายการซื้อล่าสุด: ตารางธุรกรรมเต็ม กรองช่วงวันที่ (สัปดาห์/เดือน/กำหนดเอง)
   - 📊 KPI Tracking: เปรียบเทียบแผน vs จริง รายเดือน แยกกุ้งเป็น/กุ้งดอง
     แสดงสถานะ % ความสำเร็จด้วยสี (ผ่าน/เตือน/ไม่ผ่าน)
   - 💲 ราคาคาดการณ์: แนวโน้มราคากุ้งขาว/กุ้งกุลาดำ แยกขนาด รายสัปดาห์+รายเดือน
   - 🔍 เปรียบเทียบราคา: heatmap ราคาตามผู้ขาย, matrix ขนาด-ราคา-ปริมาณ
4. ธีมสว่าง ทอง #B5780A + ฟ้า #0277BD ฟอนต์ Noto Sans Thai / Space Grotesk
5. ทำเป็น PWA: manifest.json (name "KST RM — Procurement Dashboard",
   start_url ./kst_rm_v17.html, theme #C8982A) + sw.js cache "kst-rm-v17"
   แบบ network-first (ยกเว้นโดเมน Microsoft/SharePoint) พร้อม offline fallback
```

---

## Prompt 3 — KST Collaborative Hub v3 (`kst_collab_hub_v3.html`)

```
สร้างเว็บแอปไฟล์เดียว kst_collab_hub_v3.html "KST Collaborative Hub v3"
(Vanilla JS ธีมมืด navy #0D1B2E ตัวอักษร #E8ECF1 accent cyan/gold
ฟอนต์ Space Grotesk + Noto Sans Thai)

1. Backend: Firebase Realtime Database (compat v10.12.0)
   project "kst-collab", DB asia-southeast1
2. โมดูล 7 ส่วน sync แบบ realtime:
   kst/orders, kst/targets, kst/pos, kst/actuals, kst/qc, kst/shipments,
   kst/notifications (id, dept, msg, time)
3. CRUD helper: fbSet(path,obj), fbUpd(path,id,upd), fbDel(path,id), fbNote(dept,msg)
4. แสดงสถานะเชื่อมต่อด้วย .info/connected
5. Auth คู่: Firebase (anonymous/email) + Microsoft 365 MSAL (inline, PKCE)
6. เสริม: ค้นหาไฟล์ "Procurement_Master_File" บน SharePoint ผ่าน Graph API
   (มี endpoint fallback หลายชั้น)
```

---

## Prompt 4 — แอปใหม่บน Supabase (KST RM Hub)

> ใช้ Supabase project: **`iqwsfnugjnjrpgjrqsxw`**
> URL: `https://iqwsfnugjnjrpgjrqsxw.supabase.co` (ใส่ anon key จาก Dashboard → Settings → API)

```
สร้างเว็บแอปไฟล์เดียว kst_rm_supabase.html "KST RM Hub" สำหรับบันทึกและ
วิเคราะห์การรับซื้อวัตถุดิบกุ้งของ KST Hatyai โดยใช้ Supabase เป็น backend ทั้งหมด
(แทน SharePoint/Firebase) — Vanilla JS + Chart.js + @supabase/supabase-js v2 ผ่าน CDN

1. การเชื่อมต่อ
   const supabase = createClient(
     'https://iqwsfnugjnjrpgjrqsxw.supabase.co', '<ANON_KEY>');

2. ตาราง (สร้างด้วย SQL ใน Supabase SQL Editor)
   - rm_records: id uuid pk default gen_random_uuid(), d date not null,
     bill text, type text check (type in ('กุ้งเป็น','กุ้งดอง')),
     species text check (species in ('กุ้งขาว','กุ้งกุลาดำ','กุ้งทะเล')),
     size numeric, qty numeric not null, price numeric, prov text, remark text,
     created_at timestamptz default now(), created_by uuid references auth.users
   - kpi_targets: id, month date, type text, plan_qty numeric, plan_value numeric
   - orders, qc, shipments, notifications (โครงเดียวกับ Collab Hub:
     id, dept, payload jsonb, msg, created_at)
   - เปิด Row Level Security ทุกตาราง: อ่าน/เขียนได้เฉพาะ authenticated users
   - เปิด Realtime (supabase_realtime publication) ให้ rm_records และ notifications

3. Auth: Supabase Auth แบบ email/password (จำกัดโดเมน @kst-hatyai.com
   ด้วย trigger หรือ hook ตรวจ email ก่อน insert ใน auth.users)
   หน้า login + แสดงอีเมลผู้ใช้ + ปุ่มออกจากระบบ

4. ฟีเจอร์
   - ฟอร์มบันทึกรับซื้อรายวัน (วันที่/บิล/ประเภท/ชนิด/ขนาด/ปริมาณ/ราคา/จังหวัด/หมายเหตุ)
     พร้อม import จากไฟล์ Excel ด้วย SheetJS (map หัวคอลัมน์ไทยอัตโนมัติ)
   - Dashboard: การ์ดสรุป (ปริมาณ/มูลค่า/ราคาเฉลี่ย), กราฟรายวัน-รายเดือน,
     Top ผู้ขาย, เปรียบเทียบแผน vs จริงจาก kpi_targets
   - ตารางรายการล่าสุด แก้ไข/ลบได้ (update/delete ผ่าน supabase-js)
   - แจ้งเตือน realtime: subscribe channel ตาราง notifications แสดง toast ทันที
   - Query ตัวอย่าง: supabase.from('rm_records').select('*')
     .gte('d', start).lte('d', end).order('d', { ascending: false })

5. ดีไซน์: ธีมเดียวกับชุดเดิม — navy #0D1B2E + ทอง #C8982A
   ฟอนต์ Noto Sans Thai, สีประเภท: กุ้งเป็น #e8456b, กุ้งดอง #5b6b7b,
   กุ้งขาว #1a73e8, กุ้งกุลาดำ #2b2f36, กุ้งทะเล #0f9488

6. Deploy บน GitHub Pages ใน repo kst-rm-dashboard และทำ PWA
   (เพิ่มเข้า manifest.json + sw.js เดิม)
```

---

## หมายเหตุการใช้งาน

- Prompt 1–3 คือสเปกของแอปที่มีอยู่แล้วใน GitHub — ใช้เมื่อต้องการสร้างใหม่/แก้ไขใหญ่
- Prompt 4 คือแอปใหม่ที่ย้าย backend มาอยู่บน Supabase ทั้งหมด
- ห้าม hardcode `service_role` key ในไฟล์ HTML — ใช้ได้เฉพาะ `anon` key + RLS เท่านั้น
- ทุกแอป deploy ผ่าน GitHub Pages (Settings → Pages → main branch / root)

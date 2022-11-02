# authennhso
# INSTALL PROGRAM 
COPPY FILE https://github.com/wsewathit/authennhso/tree/main/release-builds/NHSOAUTHEN_V651102
CONFIG EXAMPLE.ENV 
INSTALL RUNTIME 
https://github.com/wsewathit/authennhso/tree/main/release-builds/NHSOAUTHEN_V651102/CRRuntime_32bit_13_0_21.msi


แนวทางการใช้งานสำหรับการ AUTHEN สปสช
• ทำการเสียบบัตรประชาชนผู้รับบริการ
• ระบบจะทำการเก็บ correlationId และ DATA ที่ได้รับจาก สปสชมาไว้ที่ ฐานข้อมูล
• หลังจากนั้น ตั้งค่าการส่งทุกเย็น โดยส่งผ่าน SERVICE อีกครั้ง 
import React from "react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
    const navigate = useNavigate();

  const store = {
    description: "ร้านบอร์ดเกมครบวงจรสำหรับทุกคนที่รักการเล่นเกม เรามีทั้งเกมวางแผน เกมครอบครัว และเกมปาร์ตี้ให้เลือกมากมาย พร้อมทีมงานที่รักในบอร์ดเกมไม่แพ้คุณ!",
    staff: [
      {
        name: "น.ส.ชนม์นิภา  คำนูณวัฒน์",
        role: "หน้าที่ ",
        image: "/images/staff1.jpg",
        studentId:"660710701",
      },
      {
        name: "นายพีรพัชร  คล้ายสำเนียง",
        role: "หน้าที่",
        image: "/images/staff2.jpg",
        studentId:"660710729",
      },
      {
        name: "น.ส.อโนชา ทองด้วง",
        role: "หน้าที่",
        image: "/images/staff3.jpg",
         studentId:"660710749",
      },
      {
        name: "น.ส.ธีมาพร  เรืองศรี",
        role: "หน้าที่",
        image: "/images/staff4.jpg",
        studentId:"660710761",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-red-50 text-gray-800">

      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-b from-red-600 to-red-400 text-white">
        <h1 className="text-4xl font-bold mb-2">เกี่ยวกับเรา</h1>
        <p className="text-lg">{store.description}</p>
      </section>

      {/* Staff Section */}
      <section className="py-16 bg-red-50">
        <h3 className="text-3xl font-semibold text-center text-red-700 mb-10">
          ทีมงานของเรา
        </h3>

       <div className="max-w-screen-xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-14 px-10 justify-items-center">


          {store.staff.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition text-center p-10 border border-yellow-200 w-72"

            >
              <div className="w-36 h-36 mx-auto rounded-full overflow-hidden mb-4 border-4 border-red-500 shadow-sm">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-1">
                {member.name}
              </h4>
              <p className="text-gray-600 text-sm mb-1">
               {member.studentId}
              </p>
              <p className="text-red-600 text-sm font-medium">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

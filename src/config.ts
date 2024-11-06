export const SiteTitle = "Random English Day";
export const AdminName = "Ladit";
export const PageSize = 15;

export const LIGHT_MODE = 'light';
export const DARK_MODE = 'dark';

export const Members: Record<string, Record<string, string | boolean>> = {
  Kwan: { image: "/random-english-day/images/Kwan.jpg", isChecked: true },
  Mix: { image: "/random-english-day/images/Mix.JPG", isChecked: true },
  Jam: { image: "/random-english-day/images/Jam.jpg", isChecked: true },
  Am: { image: null, isChecked: true },
  Muay: { image: "/random-english-day/images/Muay.jpg", isChecked: true },
  Tata: { image: "/random-english-day/images/Tata.JPG", isChecked: true },
  Tung: { image: "/random-english-day/images/Tung.jpg", isChecked: true },
  Nuker: { image: "/random-english-day/images/nuker.jpg", isChecked: true },
  Earth: { image: "/random-english-day/images/Earth.JPG", isChecked: true },
  Nick: { image: "/random-english-day/images/Nick.JPG", isChecked: true },
  Koo: { image: "/random-english-day/images/Koo.jpg", isChecked: true },
  M: { image: "/random-english-day/images/M.jpg", isChecked: true },
  Aon: { image: "/random-english-day/images/Aon.JPG", isChecked: true },
};

export const Topics: string[] = [
  "Travel Experiences: พูดคุยเกี่ยวกับการท่องเที่ยว สถานที่ที่เคยไปและประสบการณ์ที่ได้รับ",
  "Favorite Movies: หารือเกี่ยวกับหนังเรื่องโปรด หนังที่เพิ่งดูและรีวิวหนัง",
  "Music Preferences: แชร์เกี่ยวกับแนวเพลงหรือศิลปินที่ชื่นชอบ เพลงใหม่ที่น่าสนใจ",
  "Books and Literature: คุยเกี่ยวกับหนังสือเล่มโปรดหรือหนังสือที่กำลังอ่าน",
  "Hobbies and Interests: แบ่งปันกิจกรรมที่ทำในเวลาว่าง งานอดิเรกที่ชอบ",
  "Cultural Differences: พูดคุยเกี่ยวกับความแตกต่างทางวัฒนธรรมระหว่างประเทศหรือภูมิภาคต่าง ๆ",
  "Food and Cooking: หัวข้อเกี่ยวกับอาหารจานโปรด การทำอาหาร หรือสูตรที่น่าสนใจ",
  "Technology Trends: พูดถึงเทรนด์เทคโนโลยีใหม่ ๆ ที่กำลังมาแรง",
  "Fitness and Exercise: การออกกำลังกายที่ชอบและวิธีการดูแลสุขภาพ",
  "Personal Goals: แชร์เป้าหมายในชีวิตและวิธีการที่คุณกำลังทำเพื่อไปถึงเป้าหมาย",
  "Social Media Influence: พูดถึงผลกระทบของโซเชียลมีเดียต่อชีวิตประจำวัน",
  "Environmental Issues: หัวข้อเกี่ยวกับสิ่งแวดล้อม การเปลี่ยนแปลงสภาพภูมิอากาศ และการอนุรักษ์",
  "Dream Vacation: คุยเกี่ยวกับการเดินทางในฝันและสิ่งที่อยากทำเมื่อมีโอกาสไป",
  "Fashion Trends: พูดถึงแนวโน้มแฟชั่นในปัจจุบันและสไตล์ที่ชอบ",
  "Memorable Childhood Memories: แบ่งปันเรื่องราวในวัยเด็กที่น่าจดจำ",
  "Weekend Plans: พูดถึงแผนการสำหรับวันหยุดสุดสัปดาห์หรือกิจกรรมที่ชอบทำในวันหยุด",
  "Pets and Animals: คุยเกี่ยวกับสัตว์เลี้ยงหรือสัตว์ที่ชอบ",
  "Dream Job: แชร์เกี่ยวกับงานในฝันและสิ่งที่อยากทำในอนาคต",
  "Education and Learning: พูดถึงการศึกษาและทักษะใหม่ ๆ ที่กำลังเรียนรู้",
  "World News and Current Events: หัวข้อเกี่ยวกับข่าวสารและเหตุการณ์ที่เกิดขึ้นในโลก",
  "Festivals and Holidays: พูดคุยเกี่ยวกับเทศกาลและวันหยุดที่ชอบ หรือประเพณีที่น่าสนใจในแต่ละประเทศ",
  "Sports and Outdoor Activities: แบ่งปันความสนใจเกี่ยวกับกีฬา การเล่นกีฬาหรือกิจกรรมกลางแจ้งที่ชอบ",
  "Photography and Art: คุยเกี่ยวกับการถ่ายภาพ งานศิลปะ หรือศิลปินที่ชอบ",
  "Shopping Habits: พูดถึงการช้อปปิ้ง ร้านโปรด หรือสินค้าที่เพิ่งซื้อ",
  "Life in the City vs. Countryside: หัวข้อเกี่ยวกับความแตกต่างระหว่างการใช้ชีวิตในเมืองและชนบท ข้อดีข้อเสียของแต่ละแบบ",
  "Favorite TV Shows: หารือเกี่ยวกับรายการทีวีหรือซีรีส์ที่ชอบ และเหตุผลที่ทำให้ชอบ",
  "History and Heritage: คุยเกี่ยวกับประวัติศาสตร์หรือมรดกทางวัฒนธรรมของแต่ละประเทศ",
  "Personal Milestones: พูดถึงความสำเร็จหรือเหตุการณ์สำคัญในชีวิต",
  "The Importance of Friendships: หัวข้อเกี่ยวกับมิตรภาพและการสร้างความสัมพันธ์กับเพื่อน",
  "Science and Innovation: พูดถึงการค้นพบทางวิทยาศาสตร์ที่น่าสนใจ หรือเทคโนโลยีใหม่ ๆ ที่กำลังเปลี่ยนโลก",
  "Describing Your Family Members: อธิบายเกี่ยวกับสมาชิกในครอบครัว",
  "Your Free Time: เวลาว่างคุณทำอะไร ",
  "Describing Your Hometown: อธิบายเกี่ยวกับบ้านเกิดของคุณ",
  "Talk about Your First Love: พูดคุยเกี่ยวกับรักแรกของคุณ เช่น เจอกันที่ไหน ตอนอายุเท่าไหร่ ทำไมคุณถึงชอบเค้า",
];

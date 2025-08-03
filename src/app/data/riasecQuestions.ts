// src/data/riasecQuestions.ts

export type RiasecType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface Question {
  id: number;
  text: string;
  type: RiasecType;
}

export const riasecQuestions: Question[] = [
  // Realistic (R) - The Doers (15 pertanyaan)
  { id: 1, text: "Saya suka membongkar pasang dan mencari tahu cara kerja peralatan mekanik atau elektronik.", type: 'R' },
  { id: 2, text: "Saya lebih suka belajar dengan praktik langsung (praktikum) daripada membaca teori di buku.", type: 'R' },
  { id: 3, text: "Saya menikmati kegiatan di luar ruangan seperti berkemah, mendaki gunung, atau berkebun.", type: 'R' },
  { id: 4, text: "Saya pandai menggunakan perkakas tangan seperti palu, obeng, atau bor.", type: 'R' },
  { id: 5, text: "Saya tertarik pada pekerjaan yang melibatkan mesin, seperti otomotif, penerbangan, atau konstruksi.", type: 'R' },
  { id: 6, text: "Saya senang merakit model kit, furnitur, atau komponen komputer.", type: 'R' },
  { id: 7, text: "Saya merasa nyaman bekerja dengan benda-benda fisik yang bisa saya sentuh dan lihat.", type: 'R' },
  { id: 8, text: "Saya pandai membaca peta, denah, atau diagram teknis.", type: 'R' },
  { id: 9, text: "Saya tertarik merawat hewan atau tumbuhan.", type: 'R' },
  { id: 10, text: "Saya suka olahraga atau aktivitas fisik yang menantang.", type: 'R' },
  { id: 11, text: "Pekerjaan sebagai atlet, polisi, atau koki (chef) terdengar menarik bagi saya.", type: 'R' },
  { id: 12, text: "Saya lebih suka pekerjaan dengan hasil yang nyata dan terlihat jelas.", type: 'R' },
  { id: 13, text: "Saya tidak terlalu suka pekerjaan yang mengharuskan banyak diskusi atau rapat.", type: 'R' },
  { id: 14, text: "Saya bisa mengikuti instruksi manual untuk memperbaiki atau merakit sesuatu.", type: 'R' },
  { id: 15, text: "Saya tertarik pada bidang pertanian, perikanan, atau kehutanan.", type: 'R' },

  // Investigative (I) - The Thinkers (15 pertanyaan)
  { id: 16, text: "Saya senang memecahkan teka-teki logika, soal matematika yang rumit, atau masalah strategis.", type: 'I' },
  { id: 17, text: "Saya sering menghabiskan waktu untuk membaca tentang topik sains, teknologi, atau sejarah.", type: 'I' },
  { id: 18, text: "Saya menikmati melakukan eksperimen di laboratorium (misalnya Kimia atau Fisika).", type: 'I' },
  { id: 19, text: "Saya sering bertanya 'mengapa' dan tidak puas sebelum menemukan penjelasan yang logis.", type: 'I' },
  { id: 20, text: "Saya tertarik pada karier sebagai ilmuwan, peneliti, dokter, atau analis data.", type: 'I' },
  { id: 21, text: "Saya suka mengamati dan menganalisis data untuk menemukan sebuah pola atau tren.", type: 'I' },
  { id: 22, text: "Saya lebih suka bekerja sendiri untuk fokus memikirkan suatu masalah.", type: 'I' },
  { id: 23, text: "Saya pandai dalam pelajaran seperti Matematika, Fisika, Biologi, atau Kimia.", type: 'I' },
  { id: 24, text: "Saya suka mempelajari ide-ide dan teori-teori yang abstrak dan kompleks.", type: 'I' },
  { id: 25, text: "Sebelum membuat keputusan, saya selalu berusaha mengumpulkan semua fakta terlebih dahulu.", type: 'I' },
  { id: 26, text: "Belajar bahasa pemrograman atau cara kerja algoritma adalah hal yang menarik.", type: 'I' },
  { id: 27, text: "Saya suka mengunjungi museum sains atau planetarium.", type: 'I' },
  { id: 28, text: "Saya bisa menjelaskan konsep-konsep ilmiah yang rumit kepada orang lain.", type: 'I' },
  { id: 29, text: "Pekerjaan yang melibatkan banyak riset dan analisis terdengar menantang.", type: 'I' },
  { id: 30, text: "Saya tidak suka melakukan tugas tanpa memahami tujuan dan alasannya.", type: 'I' },

  // Artistic (A) - The Creators (15 pertanyaan)
  { id: 31, text: "Saya suka mengekspresikan ide-ide saya melalui tulisan, gambar, musik, atau tarian.", type: 'A' },
  { id: 32, text: "Saya sering memiliki ide-ide yang imajinatif dan 'out-of-the-box'.", type: 'A' },
  { id: 33, text: "Saya tidak suka pekerjaan dengan banyak aturan atau struktur yang kaku.", type: 'A' },
  { id: 34, text: "Saya menikmati kegiatan seperti mendesain poster, mengedit video, atau fotografi.", type: 'A' },
  { id: 35, text: "Saya tertarik pada karier sebagai seniman, musisi, penulis, desainer grafis, atau arsitek.", type: 'A' },
  { id: 36, text: "Saya pandai mencocokkan warna, bentuk, dan gaya (misalnya dalam berpakaian atau mendekorasi).", type: 'A' },
  { id: 37, text: "Saya lebih suka bekerja di lingkungan yang fleksibel dan tidak formal.", type: 'A' },
  { id: 38, text: "Saya bisa memainkan alat musik atau memiliki kemampuan vokal yang baik.", type: 'A' },
  { id: 39, text: "Menulis cerpen, puisi, atau naskah drama adalah kegiatan yang saya nikmati.", type: 'A' },
  { id: 40, text: "Saya menghargai keindahan dan orisinalitas dalam sebuah karya seni.", type: 'A' },
  { id: 41, text: "Saya suka mencoba cara-cara baru untuk melakukan sesuatu, bukan mengikuti cara lama.", type: 'A' },
  { id: 42, text: "Terlibat dalam pementasan drama atau pertunjukan seni di sekolah adalah hal yang menyenangkan.", type: 'A' },
  { id: 43, text: "Saya memiliki selera yang baik dalam film, musik, atau literatur.", type: 'A' },
  { id: 44, text: "Saya sering melamun atau berimajinasi tentang berbagai macam hal.", type: 'A' },
  { id: 45, text: "Saya lebih suka menciptakan sesuatu yang baru daripada memperbaiki yang sudah ada.", type: 'A' },

  // Social (S) - The Helpers (15 pertanyaan)
  { id: 46, text: "Saya merasa puas ketika bisa membantu orang lain memecahkan masalah mereka.", type: 'S' },
  { id: 47, text: "Saya pandai mendengarkan dan memahami sudut pandang orang lain.", type: 'S' },
  { id: 48, text: "Saya suka bekerja dalam kelompok atau tim untuk mencapai tujuan bersama.", type: 'S' },
  { id: 49, text: "Mengajar atau menjelaskan sesuatu kepada teman adalah kegiatan yang saya nikmati.", type: 'S' },
  { id: 50, text: "Saya tertarik pada pekerjaan sebagai guru, konselor, perawat, atau pekerja sosial.", type: 'S' },
  { id: 51, text: "Saya sering terlibat dalam kegiatan sukarela atau organisasi sosial.", type: 'S' },
  { id: 52, text: "Saya bisa bekerja sama dengan baik dengan berbagai macam tipe orang.", type: 'S' },
  { id: 53, text: "Saya peduli dengan isu-isu keadilan sosial dan kesejahteraan masyarakat.", type: 'S' },
  { id: 54, text: "Menjadi penengah atau mediator ketika ada konflik adalah peran yang cocok untuk saya.", type: 'S' },
  { id: 55, text: "Saya lebih suka berkolaborasi daripada berkompetisi dengan orang lain.", type: 'S' },
  { id: 56, text: "Saya pandai memberikan dukungan emosional kepada teman yang sedang sedih.", type: 'S' },
  { id: 57, text: "Saya tertarik belajar tentang psikologi dan perilaku manusia.", type: 'S' },
  { id: 58, text: "Saya senang menjadi panitia dalam acara-acara sekolah atau komunitas.", type: 'S' },
  { id: 59, text: "Saya sabar dalam menghadapi orang lain, bahkan ketika mereka sulit.", type: 'S' },
  { id: 60, text: "Membuat orang lain merasa nyaman dan diterima adalah hal yang penting bagi saya.", type: 'S' },

  // Enterprising (E) - The Persuaders (15 pertanyaan)
  { id: 61, text: "Saya suka memimpin sebuah proyek atau menjadi ketua dalam suatu kelompok (misal: ketua kelas, ketua OSIS).", type: 'E' },
  { id: 62, text: "Saya pandai meyakinkan atau bernegosiasi dengan orang lain untuk mencapai kesepakatan.", type: 'E' },
  { id: 63, text: "Saya tertarik untuk memulai bisnis atau usaha saya sendiri suatu hari nanti.", type: 'E' },
  { id: 64, text: "Saya menikmati persaingan dan tertantang untuk menjadi yang terbaik.", type: 'E' },
  { id: 65, text: "Saya tertarik pada karier di bidang penjualan, pemasaran, politik, atau hukum.", type: 'E' },
  { id: 66, text: "Saya berani berbicara di depan umum atau melakukan presentasi.", type: 'E' },
  { id: 67, text: "Saya suka mengambil inisiatif dan tidak takut mengambil risiko yang diperhitungkan.", type: 'E' },
  { id: 68, text: "Saya pandai memotivasi orang lain untuk bekerja menuju tujuan bersama.", type: 'E' },
  { id: 69, text: "Saya suka bertemu orang baru dan membangun jaringan (networking).", type: 'E' },
  { id: 70, text: "Mengorganisir sebuah acara dan mempromosikannya agar sukses adalah hal yang menyenangkan.", type: 'E' },
  { id: 71, text: "Saya bercita-cita untuk memiliki posisi yang berpengaruh dan membuat keputusan penting.", type: 'E' },
  { id: 72, text: "Saya pandai berdebat dan mempertahankan argumen saya.", type: 'E' },
  { id: 73, text: "Saya suka mengikuti berita tentang ekonomi, bisnis, dan politik.", type: 'E' },
  { id: 74, text: "Saya lebih suka memimpin diskusi daripada hanya menjadi peserta.", type: 'E' },
  { id: 75, text: "Mencari peluang untuk mendapatkan keuntungan atau status adalah hal yang memotivasi saya.", type: 'E' },

  // Conventional (C) - The Organizers (15 pertanyaan)
  { id: 76, text: "Saya suka bekerja dengan data dan angka, dan memastikan semuanya akurat.", type: 'C' },
  { id: 77, text: "Saya orang yang sangat rapi, teratur, dan suka membuat rencana yang jelas.", type: 'C' },
  { id: 78, text: "Saya lebih suka mengikuti instruksi dan prosedur yang sudah ditetapkan.", type: 'C' },
  { id: 79, text: "Saya menikmati tugas-tugas yang membutuhkan ketelitian tinggi, seperti mengelola keuangan atau mengarsip dokumen.", type: 'C' },
  { id: 80, text: "Saya tertarik pada pekerjaan seperti akuntan, analis keuangan, pustakawan, atau admin.", type: 'C' },
  { id: 81, text: "Membuat daftar tugas (to-do list) dan mencentangnya membuat saya merasa puas.", type: 'C' },
  { id: 82, text: "Saya pandai menggunakan aplikasi perkantoran seperti Microsoft Excel atau Google Sheets untuk mengorganisir data.", type: 'C' },
  { id: 83, text: "Saya selalu memeriksa kembali pekerjaan saya untuk memastikan tidak ada kesalahan.", type: 'C' },
  { id: 84, text: "Saya merasa nyaman dengan pekerjaan yang memiliki rutinitas dan jadwal yang dapat diprediksi.", type: 'C' },
  { id: 85, text: "Saya bisa diandalkan untuk menyelesaikan tugas tepat waktu dan sesuai dengan standar.", type: 'C' },
  { id: 86, text: "Saya suka mengklasifikasikan dan mengkategorikan informasi agar mudah ditemukan.", type: 'C' },
  { id: 87, text: "Saya tidak suka situasi yang terlalu banyak ketidakpastian atau perubahan mendadak.", type: 'C' },
  { id: 88, text: "Menjadi bendahara kelas atau organisasi adalah peran yang saya nikmati.", type: 'C' },
  { id: 89, text: "Saya memiliki catatan pelajaran yang rapi dan terstruktur.", type: 'C' },
  { id: 90, text: "Pekerjaan yang melibatkan kepatuhan terhadap aturan dan regulasi terdengar aman bagi saya.", type: 'C' },
];
const { User, Campaign, Donation, Comment, Update } = require('./models/index.js');
const { sequelize } = require('./config/db.js');

const seed = async () => {
  try {
    console.log('Seeding FundRise database with rich demo data...');

    // 1. Create or update Admin
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@fundrise.com' },
      defaults: {
        name: 'Admin User',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
      },
    });
    await admin.update({
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    });

    // 2. Create or update Users
    const usersData = [
      {
        email: 'priya@example.com',
        name: 'Priya Sharma',
        password: 'password123',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'rohit@example.com',
        name: 'Rohit Verma',
        password: 'password123',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'amit@example.com',
        name: 'Amit Patel',
        password: 'password123',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      },
      {
        email: 'sunita@example.com',
        name: 'Sunita Rao',
        password: 'password123',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
      },
    ];

    const users = [];
    for (const u of usersData) {
      const [userInstance] = await User.findOrCreate({
        where: { email: u.email },
        defaults: u,
      });
      await userInstance.update({ avatar: u.avatar });
      users.push(userInstance);
    }

    const allUsers = [admin, ...users];

    // 3. Create or update Campaigns with high-res Unsplash imagery and active future deadlines
    const futureDate = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const campaignsData = [
      {
        title: 'Education for All Children in Rural Bihar',
        description: 'Providing school supplies, digital tablets, and certified tutoring to 200 children in need.',
        story: `Access to quality education remains a dream for hundreds of children in underprivileged villages.\n\nThrough our community learning centers, we are providing foundational literacy, math training, and digital equipment so children can build a brighter future.\n\nYour contribution directly purchases books, uniform kits, digital tablets, and hires dedicated local educators. Join us in making education accessible to every deserving child!`,
        category: 'education',
        goalAmount: 75000,
        raisedAmount: 48500,
        backersCount: 64,
        deadline: futureDate(35),
        creatorId: allUsers[1].id,
        status: 'Active',
        isVerified: true,
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
      },
      {
        title: 'Critical Heart Surgery Fund for Baby Aarav',
        description: 'Urgent financial assistance required for life-saving pediatric cardiac surgery in Mumbai.',
        story: `6-month-old Aarav was diagnosed with a severe congenital heart defect that requires urgent open-heart surgery.\n\nHis family has exhausted all their life savings on hospital consultations and oxygen therapy. The total surgery cost is ₹2,50,000.\n\nWe urgently appeal to generous supporters to help give baby Aarav a chance at life. Every single rupee counts toward his hospital treatment.`,
        category: 'medical',
        goalAmount: 250000,
        raisedAmount: 182000,
        backersCount: 142,
        deadline: futureDate(18),
        creatorId: allUsers[2].id,
        status: 'Active',
        isVerified: true,
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
      },
      {
        title: 'Solar-Powered Clean Water Wells in Rajasthan',
        description: 'Installing solar pumping stations to provide potable drinking water to 5 dry villages.',
        story: `Women and children in rural Rajasthan walk over 6 kilometers daily under scorching heat just to fetch muddy water.\n\nThis project installs 5 solar-powered borewells with multi-stage filtration units, serving over 3,000 residents sustainably for years to come.\n\nSupport this sustainable green initiative to bring health, dignity, and clean water to drought-hit families.`,
        category: 'startup',
        goalAmount: 120000,
        raisedAmount: 93500,
        backersCount: 88,
        deadline: futureDate(45),
        creatorId: allUsers[3].id,
        status: 'Active',
        isVerified: true,
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f156d?w=1200&auto=format&fit=crop&q=80',
      },
      {
        title: 'Urban Reforestation: Planting 5,000 Native Trees',
        description: 'Restoring deforested outskirts and creating urban micro-forests to fight air pollution.',
        story: `Air pollution levels in metropolitan cities are at alarming highs. Urban reforestation with native species provides the fastest carbon sink and restores ecological balance.\n\nWe partner with schools and volunteers to plant and nurture 5,000 indigenous trees with guaranteed 3-year survival tracking.\n\nBe a climate champion and sponsor a grove today!`,
        category: 'environment',
        goalAmount: 60000,
        raisedAmount: 31200,
        backersCount: 53,
        deadline: futureDate(60),
        creatorId: allUsers[1].id,
        status: 'Active',
        isVerified: false,
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80',
      },
      {
        title: 'Open Source Assistive Device for Visually Impaired',
        description: 'Developing affordable AI-powered ultrasonic navigation glasses for blind students.',
        story: `Commercial assistive glasses cost over $1,500, putting them out of reach for 99% of blind individuals in developing nations.\n\nOur open-hardware project combines spatial audio sensors, haptic feedback, and edge AI to detect obstacles and read street signs in real time.\n\nHelp us fund the prototype molds and distribute 100 free units to blind students.`,
        category: 'creative',
        goalAmount: 150000,
        raisedAmount: 76000,
        backersCount: 91,
        deadline: futureDate(50),
        creatorId: allUsers[4].id,
        status: 'Active',
        isVerified: true,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
      },
      {
        title: 'Art & Craft Scholarships for Tribal Artisans',
        description: 'Empowering traditional folk artisans with modern design mentorship and exhibition stipends.',
        story: `Centuries-old folk art forms like Madhubani, Warli, and Gond are facing extinction as younger generations abandon the craft for daily wage labor.\n\nOur scholarship program provides monthly stipends, sustainable non-toxic materials, and digital marketplace onboarding for 50 master craftswomen.\n\nPreserve cultural heritage by backing this artisan revival fund.`,
        category: 'social',
        goalAmount: 40000,
        raisedAmount: 22400,
        backersCount: 39,
        deadline: futureDate(25),
        creatorId: allUsers[2].id,
        status: 'Active',
        isVerified: false,
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop&q=80',
      },
    ];

    const campaignInstances = [];
    for (const c of campaignsData) {
      let [camp] = await Campaign.findOrCreate({
        where: { title: c.title },
        defaults: c,
      });
      // Ensure all fields including images and future deadlines are fully updated
      await camp.update(c);
      campaignInstances.push(camp);
    }

    // 4. Create donations
    const donationsData = [
      {
        orderId: 'order_seed_1',
        defaults: {
          userId: allUsers[1].id,
          campaignId: campaignInstances[0].id,
          amount: 2500,
          isAnonymous: false,
          paymentId: 'pay_seed_1',
          orderId: 'order_seed_1',
          status: 'succeeded',
        },
      },
      {
        orderId: 'order_seed_2',
        defaults: {
          userId: allUsers[2].id,
          campaignId: campaignInstances[1].id,
          amount: 5000,
          isAnonymous: false,
          paymentId: 'pay_seed_2',
          orderId: 'order_seed_2',
          status: 'succeeded',
        },
      },
      {
        orderId: 'order_seed_3',
        defaults: {
          userId: allUsers[3].id,
          campaignId: campaignInstances[2].id,
          amount: 1500,
          isAnonymous: true,
          paymentId: 'pay_seed_3',
          orderId: 'order_seed_3',
          status: 'succeeded',
        },
      },
    ];

    for (const d of donationsData) {
      await Donation.findOrCreate({
        where: { orderId: d.orderId },
        defaults: d.defaults,
      });
    }

    // 5. Create Comments
    const commentsData = [
      {
        text: 'Such a heartfelt initiative. Proud to support the education of these children!',
        userId: allUsers[2].id,
        campaignId: campaignInstances[0].id,
      },
      {
        text: 'Praying for baby Aarav\'s swift recovery. Stay strong!',
        userId: allUsers[1].id,
        campaignId: campaignInstances[1].id,
      },
      {
        text: 'Clean water changes everything. Fantastic engineering approach with solar wells.',
        userId: allUsers[3].id,
        campaignId: campaignInstances[2].id,
      },
    ];

    for (const cm of commentsData) {
      await Comment.findOrCreate({
        where: { text: cm.text },
        defaults: cm,
      });
    }

    // 6. Create Updates
    const updatesData = [
      {
        title: 'Phase 1 Classroom Supplies Distributed!',
        content: 'We distributed notebook sets and school bags to the first batch of 80 students this week. Thank you all for making this possible!',
        campaignId: campaignInstances[0].id,
      },
      {
        title: 'Pre-surgery Evaluation Completed',
        content: 'Aarav underwent pre-operative checkups at the hospital yesterday. Doctors have scheduled the procedure for next Tuesday.',
        campaignId: campaignInstances[1].id,
      },
    ];

    for (const up of updatesData) {
      await Update.findOrCreate({
        where: { title: up.title },
        defaults: up,
      });
    }

    console.log('✓ Seed data created successfully with full images, realistic metrics, and relations!');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
};

if (require.main === module) {
  sequelize.sync({ alter: true }).then(() => seed()).then(() => {
    console.log('Database seeding finished.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = seed;
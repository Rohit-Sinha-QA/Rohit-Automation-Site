// Seed data for the practice API. Everything is kept in memory, so it
// resets to this state when the server restarts or POST /api/reset is called.

const seedUsers = [
  { name: "Ravi Kumar",    email: "ravi.kumar@example.com",    job: "QA Engineer",          city: "Hyderabad", status: "active" },
  { name: "Asha Rao",      email: "asha.rao@example.com",      job: "Automation Lead",      city: "Bengaluru", status: "active" },
  { name: "John Smith",    email: "john.smith@example.com",    job: "Developer",            city: "Chennai",   status: "inactive" },
  { name: "Meera Iyer",    email: "meera.iyer@example.com",    job: "Product Manager",      city: "Mumbai",    status: "active" },
  { name: "Arjun Das",     email: "arjun.das@example.com",     job: "DevOps Engineer",      city: "Kolkata",   status: "active" },
  { name: "Priya Sharma",  email: "priya.sharma@example.com",  job: "Business Analyst",     city: "Delhi",     status: "active" },
  { name: "Karthik Reddy", email: "karthik.reddy@example.com", job: "SDET",                 city: "Hyderabad", status: "inactive" },
  { name: "Neha Gupta",    email: "neha.gupta@example.com",    job: "Performance Tester",   city: "Pune",      status: "active" },
  { name: "Vikram Singh",  email: "vikram.singh@example.com",  job: "Scrum Master",         city: "Jaipur",    status: "active" },
  { name: "Ananya Nair",   email: "ananya.nair@example.com",   job: "UI Designer",          city: "Kochi",     status: "active" },
  { name: "Rahul Verma",   email: "rahul.verma@example.com",   job: "Backend Developer",    city: "Noida",     status: "inactive" },
  { name: "Sneha Patil",   email: "sneha.patil@example.com",   job: "QA Engineer",          city: "Nagpur",    status: "active" },
];

const seedProducts = [
  { name: "Backpack",           price: 29.99, category: "Bags",        stock: 25, rating: 4.5, description: "Water-resistant 20L daypack with a padded laptop sleeve." },
  { name: "Bike Light",         price: 9.99,  category: "Accessories", stock: 40, rating: 4.1, description: "USB rechargeable front light with three brightness modes." },
  { name: "Bolt T-Shirt",       price: 15.99, category: "Clothing",    stock: 60, rating: 4.3, description: "Soft cotton crew-neck tee with the Bolt logo." },
  { name: "Fleece Jacket",      price: 49.99, category: "Clothing",    stock: 0,  rating: 4.7, description: "Mid-weight fleece for cool mornings. Currently out of stock." },
  { name: "Onesie",             price: 7.99,  category: "Clothing",    stock: 15, rating: 3.9, description: "Infant onesie in breathable organic cotton." },
  { name: "Red T-Shirt",        price: 15.99, category: "Clothing",    stock: 33, rating: 4.0, description: "Classic red tee, relaxed fit." },
  { name: "Water Bottle",       price: 12.49, category: "Accessories", stock: 80, rating: 4.6, description: "750 ml insulated steel bottle, keeps drinks cold for 24 hours." },
  { name: "Wireless Headphones",price: 79.0,  category: "Electronics", stock: 12, rating: 4.4, description: "Over-ear Bluetooth headphones with 30-hour battery life." },
  { name: "Smart Watch",        price: 129.0, category: "Electronics", stock: 8,  rating: 4.2, description: "Fitness tracking, notifications and heart-rate monitoring." },
  { name: "Running Shoes",      price: 64.5,  category: "Footwear",    stock: 20, rating: 4.5, description: "Lightweight trainers with responsive cushioning." },
  { name: "Coffee Mug",         price: 8.99,  category: "Home",        stock: 50, rating: 4.8, description: "350 ml ceramic mug, dishwasher safe." },
  { name: "Mechanical Keyboard",price: 89.99, category: "Electronics", stock: 5,  rating: 4.6, description: "Tenkeyless keyboard with hot-swappable switches." },
];

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function freshUsers() {
  const base = new Date("2026-01-05T09:00:00Z").getTime();
  return seedUsers.map((u, i) => ({
    id: i + 1,
    ...u,
    created_at: new Date(base + i * 86400000).toISOString(),
  }));
}

function freshProducts() {
  return seedProducts.map((p, i) => ({
    id: i + 1,
    ...p,
    image: `/images/products/${slug(p.name)}.svg`,
  }));
}

module.exports = { freshUsers, freshProducts, slug };

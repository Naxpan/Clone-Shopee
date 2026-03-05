import bcrypt from "bcryptjs";

const testPassword = async () => {
  const password = "admin123";
  const hashedFromDB =
    "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

  console.log("Testing password:", password);
  console.log("Hash from DB:", hashedFromDB);

  const isValid = await bcrypt.compare(password, hashedFromDB);
  console.log("Password match:", isValid);

  // Generate new hash
  const newHash = await bcrypt.hash(password, 10);
  console.log("New hash:", newHash);

  const isNewValid = await bcrypt.compare(password, newHash);
  console.log("New hash match:", isNewValid);
};

testPassword();

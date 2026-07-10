import verifyJWT from "../middleware/verifyJWT.js";

const userRoutes = (app, collections) => {
  const usersCollection = collections.users;

  // POST /users — Create or upsert a user on registration
  app.post("/users", async (req, res) => {
    const userData = req.body;
    const { email } = userData;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.send({ message: "User already exists", insertedId: null });
    }

    const result = await usersCollection.insertOne({
      ...userData,
      admin: false,
      createdAt: new Date(),
    });

    res.send(result);
  });

  // POST /cloudinary-upload — Handle profile picture upload
  // Note: For now this returns a placeholder. You can integrate Cloudinary later.
  app.post("/cloudinary-upload", async (req, res) => {
    const { name, img } = req.body;

    if (!img) {
      return res.send({ success: false, message: "No image provided" });
    }

    // Return the base64 image as-is for now
    // To integrate Cloudinary, add the cloudinary package and upload here
    res.send({
      success: true,
      img_url: img,
    });
  });

  // GET /user?email= — Get user info by email
  app.get("/user", verifyJWT, async (req, res) => {
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    const result = await usersCollection.findOne({ email });
    res.send(result || {});
  });

  // PATCH /update-user?email= — Update user profile details
  app.patch("/update-user", verifyJWT, async (req, res) => {
    const email = req.query.email;
    const updateData = req.body;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    // Remove undefined values
    const cleanData = {};
    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        cleanData[key] = value;
      }
    }

    const result = await usersCollection.updateOne(
      { email },
      { $set: cleanData }
    );

    res.send(result);
  });

  // PATCH /users/shipping-address?email= — Add/update shipping address
  app.patch("/users/shipping-address", verifyJWT, async (req, res) => {
    const email = req.query.email;
    const addressData = req.body;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    const result = await usersCollection.updateOne(
      { email },
      { $set: { shippingAddress: addressData } }
    );

    res.send(result);
  });

  // PATCH /users/delete-address?email= — Remove shipping address
  app.patch("/users/delete-address", verifyJWT, async (req, res) => {
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({ error: true, message: "Email is required" });
    }

    const result = await usersCollection.updateOne(
      { email },
      { $unset: { shippingAddress: "" } }
    );

    res.send(result);
  });
};

export default userRoutes;

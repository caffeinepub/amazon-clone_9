import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Authorization Integration
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Type
  type Product = {
    title : Text;
    description : Text;
    price : Float;
    originalPrice : Float;
    category : Text;
    imageUrl : Text;
    rating : Float;
    reviewCount : Nat;
    badge : Text;
    inStock : Bool;
  };

  module Product {
    public func compareByPrice(a : Product, b : Product) : Order.Order {
      Float.compare(a.price, b.price);
    };
  };

  // Category Type
  type Category = {
    name : Text;
    slug : Text;
  };

  module Category {
    public func compare(a : Category, b : Category) : Order.Order {
      Text.compare(a.slug, b.slug);
    };
  };

  // Stable Variables
  var productIdCounter = 0;
  var categoryIdCounter = 0;
  let products = Map.empty<Nat, Product>();
  let categories = Map.empty<Nat, Category>();

  // Product CRUD Operations
  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = productIdCounter;
    products.add(id, product);
    productIdCounter += 1;
    id;
  };

  public query ({ caller = _ }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func updateProduct(id : Nat, product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not products.containsKey(id)) { Runtime.trap("Product not found") };
    products.add(id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not products.containsKey(id)) { Runtime.trap("Product not found") };
    products.remove(id);
  };

  // Category CRUD Operations
  public shared ({ caller }) func addCategory(category : Category) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = categoryIdCounter;
    categories.add(id, category);
    categoryIdCounter += 1;
    id;
  };

  public query ({ caller = _ }) func getCategory(id : Nat) : async Category {
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?category) { category };
    };
  };

  public shared ({ caller }) func updateCategory(id : Nat, category : Category) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not categories.containsKey(id)) { Runtime.trap("Category not found") };
    categories.add(id, category);
  };

  public shared ({ caller }) func deleteCategory(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    if (not categories.containsKey(id)) { Runtime.trap("Category not found") };
    categories.remove(id);
  };

  // Product Queries
  public query ({ caller = _ }) func getProductsByCategory(categorySlug : Text) : async [Product] {
    products.values().toArray().filter(
      func(p) { p.category == categorySlug }
    );
  };

  public query ({ caller = _ }) func searchProducts(keyword : Text) : async [Product] {
    let lowerKeyword = keyword.toLower();
    products.values().toArray().filter(
      func(p) {
        p.title.toLower().contains(#text lowerKeyword) or
        p.description.toLower().contains(#text lowerKeyword);
      }
    );
  };

  public query ({ caller = _ }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller = _ }) func getAllProductsByPrice() : async [Product] {
    products.values().toArray().sort(Product.compareByPrice);
  };

  public query ({ caller = _ }) func getProductsByFilter(category : Text, sortByPrice : Bool) : async [Product] {
    var filtered = products.values().toArray().filter(
      func(p) { p.category == category }
    );
    if (sortByPrice) {
      filtered := filtered.sort(Product.compareByPrice);
    };
    filtered;
  };

  // Category Queries
  public query ({ caller = _ }) func getAllCategories() : async [Category] {
    categories.values().toArray().sort();
  };

  public query ({ caller = _ }) func getCategoryBySlug(slug : Text) : async Category {
    let category = categories.values().toArray().find(
      func(c) { c.slug == slug }
    );
    switch (category) {
      case (null) { Runtime.trap("Category not found") };
      case (?c) { c };
    };
  };

  // Internal helper functions (private)
  func addProductInternal(product : Product) {
    let id = productIdCounter;
    products.add(id, product);
    productIdCounter += 1;
  };

  func addCategoryInternal(category : Category) {
    let id = categoryIdCounter;
    categories.add(id, category);
    categoryIdCounter += 1;
  };

  func seedProducts() {
    if (not products.isEmpty()) { return };
    let sampleProducts : [Product] = [
      {
        title = "Echo Dot (4th Gen)";
        description = "Smart speaker with Alexa - Charcoal";
        price = 49.99;
        originalPrice = 59.99;
        category = "featured-products";
        imageUrl = "https://s3.amazonaws.com/pfuploads/2024/01/01181752/1-min-8.png";
        rating = 4.7;
        reviewCount = 35216;
        badge = "hot";
        inStock = true;
      },
      {
        title = "Samsung 65\" 4K Crystal UHD Smart TV";
        description = "Ultra-high definition TV with vivid colors";
        price = 697.99;
        originalPrice = 799.99;
        category = "featured-products";
        imageUrl = "https://s3.amazonaws.com/pfuploads/2024/01/01181754/2-min-8.png";
        rating = 4.5;
        reviewCount = 1423;
        badge = "sale";
        inStock = true;
      },
      {
        title = "Tile Mate (2022)";
        description = "Bluetooth tracker for keys, bags, and more";
        price = 24.99;
        originalPrice = 29.99;
        category = "gadgets";
        imageUrl = "https://s3.amazonaws.com/pfuploads/2024/01/01181756/3-min-6.png";
        rating = 4.3;
        reviewCount = 8745;
        badge = "hot";
        inStock = false;
      },
      {
        title = "Apple AirPods Pro (2nd Gen)";
        description = "Wireless earbuds with Active Noise Cancellation";
        price = 249.00;
        originalPrice = 249.00;
        category = "audio";
        imageUrl = "https://s3.amazonaws.com/pfuploads/2024/01/01181759/4-min-11.png";
        rating = 4.8;
        reviewCount = 19546;
        badge = "sale";
        inStock = true;
      },
      {
        title = "Instant Pot Duo 7-in-1";
        description = "Pressure cooker, slow cooker, rice cooker, steamer, saute, yogurt maker, warmer";
        price = 89.99;
        originalPrice = 99.99;
        category = "home";
        imageUrl = "https://s3.amazonaws.com/pfuploads/2024/01/01181802/5-min-9.png";
        rating = 4.7;
        reviewCount = 25321;
        badge = "hot";
        inStock = true;
      },
      {
        title = "Dell 27 Inch Curved Gaming Monitor";
        description = "FHD, 144Hz refresh rate, 1ms response";
        price = 299.99;
        originalPrice = 319.99;
        category = "featured-products";
        imageUrl = "https://s3.amazonaws.com/pfuploads/2024/01/01181804/6-min-9.png";
        rating = 4.6;
        reviewCount = 1684;
        badge = "new";
        inStock = true;
      },
    ];

    for (product in sampleProducts.values()) {
      addProductInternal(product);
    };
  };

  func seedCategories() {
    if (not categories.isEmpty()) { return };

    let sampleCategories : [Category] = [
      {
        name = "Featured Products";
        slug = "featured-products";
      },
      {
        name = "Gadgets";
        slug = "gadgets";
      },
      {
        name = "Audio";
        slug = "audio";
      },
      {
        name = "Home";
        slug = "home";
      },
    ];

    for (category in sampleCategories.values()) {
      addCategoryInternal(category);
    };
  };

  // Seed Data on First Deploy
  public shared ({ caller }) func seed() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    seedProducts();
    seedCategories();
  };
};

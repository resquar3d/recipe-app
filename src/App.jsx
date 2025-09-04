import React, { useMemo, useState } from "react";
import {
  ChakraProvider,
  extendTheme,
  Box,
  Heading,
  Text,
  Image,
  Input,
  Tag,
  Button,
  VStack,
  Flex,
  HStack,
  SimpleGrid,
  Badge,
  Wrap,
  WrapItem,
  Tooltip,
  Divider,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Skeleton,
  Spacer,
  useColorMode,
  useColorModeValue,
  AspectRatio,
  Container,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

import {
  MdAccessTime as TimeIcon,
  MdInfoOutline as InfoIcon,
  MdSearch as SearchIcon,
  MdDarkMode as MoonIcon,
  MdLightMode as SunIcon,
  MdWarning as WarningIcon,
} from "react-icons/md";

import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

/* =========================
   THEME — Modern & Clean
   ========================= */
const theme = extendTheme({
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      "html, body": {
        bg: props.colorMode === "dark" ? "gray.900" : "gray.50",
        color: props.colorMode === "dark" ? "gray.100" : "gray.800",
        minHeight: "100vh",
        overflowX: "hidden",
      },
    }),
  },
  components: {
    Container: {
      baseStyle: {
        maxW: "container.xl",
        px: { base: 4, md: 6 },
      },
    },
  },
});

/* =========================
   UTILITIES
   ========================= */
// Generate food images using Picsum with seed for consistency
const getFoodImage = (name) => {
  // Use Picsum with a seed based on recipe name for consistent images
  const seed = name.toLowerCase().replace(/\s+/g, '-');
  return `https://picsum.photos/seed/${seed}/800/600`;
};

// Enhanced allergen detection with more comprehensive rules
const ALLERGEN_RULES = {
  Gluten: ["wheat", "flour", "pasta", "spaghetti", "noodle", "bread", "barley", "rye", "cracker", "breadcrumbs", "batter", "tortilla", "dough", "pizza dough", "sourdough", "muffin"],
  Dairy: ["milk", "cheese", "butter", "cream", "yogurt", "parmesan", "mozzarella", "gouda", "feta", "greek yogurt"],
  Eggs: ["egg", "eggs", "mayonnaise", "aioli", "meringue"],
  Soy: ["soy", "soya", "tofu", "edamame", "miso", "tempeh", "soy sauce"],
  Peanuts: ["peanut", "peanuts", "peanut butter"],
  "Tree Nuts": ["almond", "walnut", "pecan", "cashew", "pistachio", "hazelnut", "macadamia", "brazil nut", "pine nut"],
  Fish: ["salmon", "tuna", "trout", "cod", "anchovy", "sardine", "mackerel", "halibut", "bass", "tilapia", "anchov"],
  Shellfish: ["shrimp", "prawn", "lobster", "crab", "mussel", "clam", "oyster", "scallop"],
  Sesame: ["sesame", "tahini", "sesame seeds", "sesame oil"],
  Mustard: ["mustard", "dijon"],
  Celery: ["celery", "celeriac"],
  Sulfites: ["wine", "sulfite", "sulphite", "dried fruit"],
};

const detectAllergens = (ingredients = []) => {
  const found = new Set();
  const normalizedIngredients = ingredients.map(i => String(i).toLowerCase());
  
  Object.entries(ALLERGEN_RULES).forEach(([allergen, triggers]) => {
    const hasAllergen = triggers.some(trigger => 
      normalizedIngredients.some(ing => ing.includes(trigger))
    );
    if (hasAllergen) found.add(allergen);
  });
  
  return Array.from(found);
};

/* =========================
   DATA - with realistic food images (4 per meal type)
   ========================= */
const baseRecipes = [
  // BREAKFAST (4 recipes)
  {
    id: "1",
    name: "Avocado Toast Deluxe",
    image: "https://images.pexels.com/photos/1656666/pexels-photo-1656666.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Vegetarian",
    cautions: [],
    mealType: "Breakfast",
    dishType: "Toast",
    totalTime: 10,
    healthLabels: ["Vegetarian", "High-Fiber"],
    ingredients: ["Sourdough bread", "Avocado", "Eggs", "Cherry tomatoes", "Sesame seeds", "Feta cheese"],
    servings: 1,
    totalNutrients: { ENERC_KCAL: 520, PROCNT: 18, FAT: 32, CHOCDF: 38, CHOLE: 185, NA: 640 },
  },
  {
    id: "2",
    name: "Blueberry Pancakes",
    image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Vegetarian",
    cautions: [],
    mealType: "Breakfast",
    dishType: "Pancakes",
    totalTime: 20,
    healthLabels: ["Vegetarian", "Sweet"],
    ingredients: ["Flour", "Eggs", "Milk", "Blueberries", "Maple syrup", "Butter", "Baking powder"],
    servings: 2,
    totalNutrients: { ENERC_KCAL: 450, PROCNT: 12, FAT: 15, CHOCDF: 68, CHOLE: 120, NA: 380 },
  },
  {
    id: "3",
    name: "Eggs Benedict",
    image: "https://images.pexels.com/photos/793785/pexels-photo-793785.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Classic",
    cautions: [],
    mealType: "Breakfast",
    dishType: "Eggs",
    totalTime: 25,
    healthLabels: ["High-Protein", "Indulgent"],
    ingredients: ["English muffins", "Canadian bacon", "Eggs", "Butter", "Lemon juice", "Cayenne pepper"],
    servings: 2,
    totalNutrients: { ENERC_KCAL: 580, PROCNT: 28, FAT: 38, CHOCDF: 32, CHOLE: 420, NA: 890 },
  },
  {
    id: "4",
    name: "Overnight Oats",
    image: "https://images.pexels.com/photos/543730/pexels-photo-543730.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Healthy",
    cautions: [],
    mealType: "Breakfast",
    dishType: "Oatmeal",
    totalTime: 5,
    healthLabels: ["High-Fiber", "Heart-Healthy"],
    ingredients: ["Rolled oats", "Almond milk", "Chia seeds", "Banana", "Honey", "Cinnamon", "Berries"],
    servings: 1,
    totalNutrients: { ENERC_KCAL: 320, PROCNT: 10, FAT: 8, CHOCDF: 58, CHOLE: 0, NA: 120 },
  },
  
  // LUNCH (4 recipes)
  {
    id: "5",
    name: "Caesar Salad",
    image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Classic",
    cautions: [],
    mealType: "Lunch",
    dishType: "Salad",
    totalTime: 15,
    healthLabels: ["Low-Carb", "Fresh"],
    ingredients: ["Romaine lettuce", "Parmesan cheese", "Croutons", "Caesar dressing", "Lemon", "Anchovies"],
    servings: 2,
    totalNutrients: { ENERC_KCAL: 380, PROCNT: 12, FAT: 28, CHOCDF: 22, CHOLE: 45, NA: 680 },
  },
  {
    id: "6",
    name: "Chicken Teriyaki Bowl",
    image: "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Balanced",
    cautions: [],
    mealType: "Lunch",
    dishType: "Bowl",
    totalTime: 35,
    healthLabels: ["High-Protein", "Balanced"],
    ingredients: ["Chicken thighs", "Rice", "Soy sauce", "Honey", "Ginger", "Garlic", "Sesame oil"],
    servings: 3,
    totalNutrients: { ENERC_KCAL: 780, PROCNT: 40, FAT: 20, CHOCDF: 110, CHOLE: 120, NA: 1000 },
  },
  {
    id: "7",
    name: "Mediterranean Wrap",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Mediterranean",
    cautions: [],
    mealType: "Lunch",
    dishType: "Wrap",
    totalTime: 15,
    healthLabels: ["Balanced", "Fresh"],
    ingredients: ["Whole wheat tortilla", "Hummus", "Grilled chicken", "Cucumber", "Tomatoes", "Feta cheese", "Olives"],
    servings: 1,
    totalNutrients: { ENERC_KCAL: 420, PROCNT: 28, FAT: 18, CHOCDF: 42, CHOLE: 65, NA: 780 },
  },
  {
    id: "8",
    name: "Quinoa Power Bowl",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Vegan",
    cautions: [],
    mealType: "Lunch",
    dishType: "Bowl",
    totalTime: 25,
    healthLabels: ["Vegan", "Gluten-Free", "High-Protein"],
    ingredients: ["Quinoa", "Kale", "Roasted sweet potato", "Chickpeas", "Tahini", "Lemon"],
    servings: 2,
    totalNutrients: { ENERC_KCAL: 560, PROCNT: 20, FAT: 18, CHOCDF: 78, CHOLE: 0, NA: 360 },
  },
  
  // DINNER (4 recipes)
  {
    id: "9",
    name: "Spaghetti Bolognese",
    image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Classic Italian",
    cautions: [],
    mealType: "Dinner",
    dishType: "Main course",
    totalTime: 45,
    healthLabels: ["High-Protein"],
    ingredients: ["Spaghetti pasta", "Tomatoes", "Ground beef", "Garlic", "Onion", "Olive oil", "Parmesan cheese"],
    servings: 4,
    totalNutrients: { ENERC_KCAL: 800, PROCNT: 40, FAT: 25, CHOCDF: 90, CHOLE: 60, NA: 500 },
  },
  {
    id: "10",
    name: "Grilled Salmon with Quinoa",
    image: "https://images.pexels.com/photos/3655916/pexels-photo-3655916.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Pescatarian",
    cautions: [],
    mealType: "Dinner",
    dishType: "Main course",
    totalTime: 30,
    healthLabels: ["High-Protein", "Omega-3 Rich"],
    ingredients: ["Salmon fillet", "Quinoa", "Lemon", "Dill", "Olive oil", "Garlic"],
    servings: 2,
    totalNutrients: { ENERC_KCAL: 620, PROCNT: 45, FAT: 28, CHOCDF: 48, CHOLE: 90, NA: 380 },
  },
  {
    id: "11",
    name: "Thai Green Curry",
    image: "https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Spicy",
    cautions: [],
    mealType: "Dinner",
    dishType: "Curry",
    totalTime: 40,
    healthLabels: ["Gluten-Free", "Spicy"],
    ingredients: ["Coconut milk", "Green curry paste", "Shrimp", "Bamboo shoots", "Thai basil", "Fish sauce"],
    servings: 4,
    totalNutrients: { ENERC_KCAL: 690, PROCNT: 30, FAT: 48, CHOCDF: 40, CHOLE: 170, NA: 900 },
  },
  {
    id: "12",
    name: "Margherita Pizza",
    image: "https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Vegetarian",
    cautions: [],
    mealType: "Dinner",
    dishType: "Pizza",
    totalTime: 20,
    healthLabels: ["Vegetarian", "Italian"],
    ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella cheese", "Fresh basil", "Olive oil"],
    servings: 2,
    totalNutrients: { ENERC_KCAL: 900, PROCNT: 36, FAT: 30, CHOCDF: 120, CHOLE: 70, NA: 850 },
  },
  
  // SNACKS (4 recipes)
  {
    id: "13",
    name: "Berry Yogurt Parfait",
    image: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Vegetarian",
    cautions: [],
    mealType: "Snack",
    dishType: "Dessert",
    totalTime: 8,
    healthLabels: ["Vegetarian", "Probiotic"],
    ingredients: ["Greek yogurt", "Blueberries", "Strawberries", "Honey", "Granola"],
    servings: 2,
    totalNutrients: { ENERC_KCAL: 380, PROCNT: 18, FAT: 8, CHOCDF: 62, CHOLE: 15, NA: 110 },
  },
  {
    id: "14",
    name: "Hummus & Veggies",
    image: "https://images.pexels.com/photos/1893555/pexels-photo-1893555.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Vegan",
    cautions: [],
    mealType: "Snack",
    dishType: "Appetizer",
    totalTime: 5,
    healthLabels: ["Vegan", "High-Fiber"],
    ingredients: ["Hummus", "Carrots", "Celery", "Bell peppers", "Cucumber", "Cherry tomatoes"],
    servings: 2,
    totalNutrients: { ENERC_KCAL: 180, PROCNT: 6, FAT: 10, CHOCDF: 20, CHOLE: 0, NA: 340 },
  },
  {
    id: "15",
    name: "Energy Balls",
    image: "https://images.pexels.com/photos/4099237/pexels-photo-4099237.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Healthy",
    cautions: [],
    mealType: "Snack",
    dishType: "Snack",
    totalTime: 15,
    healthLabels: ["No-Bake", "Energy-Boost"],
    ingredients: ["Dates", "Almonds", "Cocoa powder", "Coconut flakes", "Chia seeds", "Honey"],
    servings: 12,
    totalNutrients: { ENERC_KCAL: 280, PROCNT: 5, FAT: 12, CHOCDF: 40, CHOLE: 0, NA: 20 },
  },
  {
    id: "16",
    name: "Cheese & Crackers",
    image: "https://images.pexels.com/photos/3622479/pexels-photo-3622479.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
    dietLabel: "Classic",
    cautions: [],
    mealType: "Snack",
    dishType: "Appetizer",
    totalTime: 5,
    healthLabels: ["Quick", "Savory"],
    ingredients: ["Assorted cheeses", "Whole grain crackers", "Grapes", "Almonds", "Fig jam"],
    servings: 4,
    totalNutrients: { ENERC_KCAL: 320, PROCNT: 14, FAT: 20, CHOCDF: 24, CHOLE: 35, NA: 460 },
  },
];

/* =========================
   NAVBAR
   ========================= */
const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      bg={bg}
      position="sticky"
      top={0}
      zIndex={100}
      borderBottom="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Container maxW="container.xl" py={4}>
        <Flex align="center" justify="space-between">
          <HStack spacing={8}>
            <Box fontWeight="bold" fontSize="xl" color={useColorModeValue("purple.600", "purple.400")}>
              🍽️ Romy Hub Recipe
            </Box>
            <HStack spacing={5} display={{ base: "none", md: "flex" }}>
              <Text cursor="pointer">Home</Text>
              <Text cursor="pointer">Recipes</Text>
            </HStack>
          </HStack>
          <IconButton
            aria-label="Toggle color mode"
            variant="ghost"
            onClick={toggleColorMode}
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          />
        </Flex>
      </Container>
    </Box>
  );
};

/* =========================
   HERO
   ========================= */
const Hero = () => {
  const bg = useColorModeValue("purple.50", "gray.800");
  
  return (
    <Box bg={bg} py={{ base: 8, md: 12 }}>
      <Container>
        <VStack spacing={4} textAlign="center">
          <Heading size="2xl" bgGradient="linear(to-r, purple.500, pink.500)" bgClip="text">
            Delicious Healthy Recipes
          </Heading>
          <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")}>
            Find your next dietary favorite meal with detailed nutrition and allergen information!
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

/* =========================
   RECIPE CARD
   ========================= */
const RecipeCard = ({ recipe, onOpen }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  
  const allergens = detectAllergens(recipe.ingredients);
  const hasAllergens = allergens.length > 0;

  return (
    <Box
      onClick={() => onOpen(recipe)}
      p={0}
      borderRadius="lg"
      bg={cardBg}
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "xl" }}
      cursor="pointer"
    >
      <Box position="relative" height="200px" bg="gray.200">
        {!imgLoaded && !imgError && <Skeleton height="200px" />}
        <Image
          src={recipe.image || getFoodImage(recipe.name, recipe.id)}
          alt={recipe.name}
          width="100%"
          height="200px"
          objectFit="cover"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgError(true);
            setImgLoaded(true);
          }}
          display={imgLoaded ? "block" : "none"}
        />
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="black"
          px={2}
          py={1}
        >
          <TimeIcon style={{ marginRight: "4px", marginBottom: "-2px" }} />
          {recipe.totalTime}m
        </Badge>
        {hasAllergens && (
          <Badge
            position="absolute"
            top={2}
            left={2}
            colorScheme="red"
            px={2}
            py={1}
          >
            <WarningIcon style={{ marginRight: "4px", marginBottom: "-2px" }} />
            Allergens
          </Badge>
        )}
      </Box>

      <VStack align="start" p={4} spacing={3}>
        <Heading size="md" noOfLines={1}>{recipe.name}</Heading>
        <HStack spacing={2} flexWrap="wrap">
          <Tag size="sm" colorScheme="purple">{recipe.dietLabel}</Tag>
          <Tag size="sm" colorScheme="green">{recipe.mealType}</Tag>
          <Tag size="sm" colorScheme="blue">{recipe.dishType}</Tag>
        </HStack>
        {recipe.healthLabels && (
          <Wrap spacing={1}>
            {recipe.healthLabels.slice(0, 3).map((label) => (
              <WrapItem key={label}>
                <Tag size="sm" variant="subtle">{label}</Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}
      </VStack>
    </Box>
  );
};

/* =========================
   RECIPE MODAL
   ========================= */
const RecipeModal = ({ isOpen, onClose, recipe }) => {
  const bg = useColorModeValue("white", "gray.800");
  
  if (!recipe) return null;
  
  const allergens = detectAllergens(recipe.ingredients);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg={bg}>
        <Box position="relative" height="250px" bg="gray.200">
          <Image
            src={recipe.image || getFoodImage(recipe.name, recipe.id)}
            alt={recipe.name}
            width="100%"
            height="250px"
            objectFit="cover"
          />
          <Badge
            position="absolute"
            top={4}
            right={4}
            colorScheme="black"
            fontSize="md"
            px={3}
            py={2}
          >
            <TimeIcon style={{ marginRight: "6px", marginBottom: "-2px" }} />
            {recipe.totalTime} minutes
          </Badge>
        </Box>
        
        <ModalHeader>
          <VStack align="start" spacing={3}>
            <Heading size="lg">{recipe.name}</Heading>
            <HStack spacing={2}>
              <Tag colorScheme="purple">{recipe.dietLabel}</Tag>
              <Tag colorScheme="green">{recipe.mealType}</Tag>
              <Tag colorScheme="blue">{recipe.dishType}</Tag>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
            <Box>
              <Heading size="sm" mb={3}>Ingredients ({recipe.servings} servings)</Heading>
              <VStack align="start" spacing={2}>
                {recipe.ingredients.map((ingredient, idx) => (
                  <HStack key={idx} spacing={2}>
                    <Box w="6px" h="6px" bg="green.500" borderRadius="full" />
                    <Text>{ingredient}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Box>
              <Heading size="sm" mb={3}>Nutrition Facts (total)</Heading>
              <SimpleGrid columns={2} spacing={2}>
                <NutrientCard label="Calories" value={`${recipe.totalNutrients.ENERC_KCAL}`} unit="kcal" />
                <NutrientCard label="Protein" value={`${recipe.totalNutrients.PROCNT}`} unit="g" />
                <NutrientCard label="Fat" value={`${recipe.totalNutrients.FAT}`} unit="g" />
                <NutrientCard label="Carbs" value={`${recipe.totalNutrients.CHOCDF}`} unit="g" />
                <NutrientCard label="Cholesterol" value={`${recipe.totalNutrients.CHOLE}`} unit="mg" />
                <NutrientCard label="Sodium" value={`${recipe.totalNutrients.NA}`} unit="mg" />
              </SimpleGrid>
            </Box>
          </SimpleGrid>

          <Divider />

          <Box mt={6}>
            <Heading size="sm" mb={3}>Allergen Information</Heading>
            {allergens.length > 0 ? (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold" mb={2}>This recipe contains:</Text>
                  <Wrap>
                    {allergens.map((allergen) => (
                      <WrapItem key={allergen}>
                        <Tag colorScheme="orange" size="lg">{allergen}</Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              </Alert>
            ) : (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                No common allergens detected in this recipe
              </Alert>
            )}
          </Box>

          {recipe.healthLabels && recipe.healthLabels.length > 0 && (
            <Box mt={6}>
              <Heading size="sm" mb={3}>Health Labels</Heading>
              <Wrap>
                {recipe.healthLabels.map((label) => (
                  <WrapItem key={label}>
                    <Tag colorScheme="green" size="lg">{label}</Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="purple" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const NutrientCard = ({ label, value, unit }) => {
  const bg = useColorModeValue("gray.50", "gray.700");
  
  return (
    <Box p={3} bg={bg} borderRadius="md">
      <Text fontSize="xs" color="gray.500">{label}</Text>
      <Text fontWeight="bold">
        {value} <Text as="span" fontSize="sm" fontWeight="normal">{unit}</Text>
      </Text>
    </Box>
  );
};

/* =========================
   RECIPES OVERVIEW
   ========================= */
const RecipesOverview = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const filtered = useMemo(() => {
    if (!search.trim()) return baseRecipes;
    const query = search.toLowerCase();
    return baseRecipes.filter(recipe => {
      const searchableText = [
        recipe.name,
        recipe.dietLabel,
        recipe.mealType,
        recipe.dishType,
        ...(recipe.healthLabels || []),
        ...(recipe.ingredients || [])
      ].join(" ").toLowerCase();
      return searchableText.includes(query);
    });
  }, [search]);

  const handleOpen = (recipe) => {
    setSelected(recipe);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading>All Recipes</Heading>
        
        <HStack spacing={4}>
          <Box position="relative" flex="1">
            <Input
              placeholder="Search recipes, ingredients, or dietary preferences..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              pl="40px"
              size="lg"
            />
            <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)">
              <SearchIcon />
            </Box>
          </Box>
          <Button
            onClick={() => setSearch("")}
            variant="outline"
            display={{ base: "none", md: "flex" }}
          >
            Clear
          </Button>
        </HStack>

        <HStack spacing={2} display={{ base: "none", md: "flex" }}>
          {["Breakfast", "Lunch", "Dinner", "Snack", "Vegan", "Vegetarian"].map((term) => (
            <Button
              key={term}
              size="sm"
              variant="outline"
              onClick={() => setSearch(term)}
            >
              {term}
            </Button>
          ))}
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onOpen={handleOpen} />
          ))}
        </SimpleGrid>

        {filtered.length === 0 && (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">
              No recipes found matching "{search}"
            </Text>
            <Button mt={4} onClick={() => setSearch("")}>
              Clear search
            </Button>
          </Box>
        )}
      </VStack>

      <RecipeModal isOpen={isOpen} onClose={onClose} recipe={selected} />
    </Container>
  );
};

/* =========================
   FOOTER
   ========================= */
const Footer = () => {
  const bg = useColorModeValue("gray.900", "gray.950");
  const borderColor = useColorModeValue("gray.700", "gray.800");
  const headingColor = "white";
  const textColor = useColorModeValue("gray.400", "gray.500");
  const linkHoverColor = useColorModeValue("blue.400", "blue.300");

  return (
    <Box bg={bg} color="white" mt="auto">
      {/* Main Footer Content */}
      <Container maxW="container.xl" py={12}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {/* About Section */}
          <VStack align="start" spacing={4}>
            <Heading size="md" color={headingColor}>
              🍽️ Romy Hub Recipes
            </Heading>
            <Text color={textColor} fontSize="sm">
              Discover delicious recipes from around the world. Cook with confidence at ease using our detailed nutrition and allergen information.
            </Text>
            <HStack spacing={3}>
              <IconButton
                as="a"
                href="https://github.com"
                target="_blank"
                aria-label="GitHub"
                icon={<FaGithub />}
                variant="ghost"
                colorScheme="whiteAlpha"
                _hover={{ color: linkHoverColor, transform: "translateY(-2px)" }}
                transition="all 0.2s"
              />
              <IconButton
                as="a"
                href="https://linkedin.com"
                target="_blank"
                aria-label="LinkedIn"
                icon={<FaLinkedin />}
                variant="ghost"
                colorScheme="whiteAlpha"
                _hover={{ color: linkHoverColor, transform: "translateY(-2px)" }}
                transition="all 0.2s"
              />
              <IconButton
                as="a"
                href="https://facebook.com"
                target="_blank"
                aria-label="Facebook"
                icon={<FaFacebook />}
                variant="ghost"
                colorScheme="whiteAlpha"
                _hover={{ color: linkHoverColor, transform: "translateY(-2px)" }}
                transition="all 0.2s"
              />
              <IconButton
                as="a"
                href="https://instagram.com"
                target="_blank"
                aria-label="Instagram"
                icon={<FaInstagram />}
                variant="ghost"
                colorScheme="whiteAlpha"
                _hover={{ color: linkHoverColor, transform: "translateY(-2px)" }}
                transition="all 0.2s"
              />
            </HStack>
          </VStack>

          {/* Quick Links */}
          <VStack align="start" spacing={3}>
            <Heading size="sm" color={headingColor}>
              Quick Links
            </Heading>
            <VStack align="start" spacing={2}>
              <Text as="a" href="#" color={textColor} fontSize="sm" _hover={{ color: linkHoverColor }}>
                Home
              </Text>
              <Text as="a" href="#" color={textColor} fontSize="sm" _hover={{ color: linkHoverColor }}>
                All Recipes
              </Text>
              <Text as="a" href="#" color={textColor} fontSize="sm" _hover={{ color: linkHoverColor }}>
                Meal Planning
              </Text>
              <Text as="a" href="#" color={textColor} fontSize="sm" _hover={{ color: linkHoverColor }}>
                Nutrition Guide
              </Text>
            </VStack>
          </VStack>

          {/* Categories */}
          <VStack align="start" spacing={3}>
            <Heading size="sm" color={headingColor}>
              Categories
            </Heading>
            <VStack align="start" spacing={2}>
              <Text as="a" href="#" color={textColor} fontSize="sm" _hover={{ color: linkHoverColor }}>
                Breakfast
              </Text>
              <Text as="a" href="#" color={textColor} fontSize="sm" _hover={{ color: linkHoverColor }}>
                Lunch
              </Text>
              <Text as="a" href="#" color={textColor} fontSize="sm" _hover={{ color: linkHoverColor }}>
                Dinner
              </Text>
              <Text as="a" href="#" color={textColor} fontSize="sm" _hover={{ color: linkHoverColor }}>
                Snacks
              </Text>
            </VStack>
          </VStack>

          {/* Contact */}
          <VStack align="start" spacing={3}>
            <Heading size="sm" color={headingColor}>
              Contact Us
            </Heading>
            <VStack align="start" spacing={2}>
              <HStack spacing={2}>
                <FaEnvelope size="14" />
                <Text color={textColor} fontSize="sm">hello@romyhubrecipes.com</Text>
              </HStack>
              <HStack spacing={2}>
                <FaPhone size="14" />
                <Text color={textColor} fontSize="sm">+1 (555) 123-4567</Text>
              </HStack>
              <HStack spacing={2} align="start">
                <Box pt={1}>
                  <FaMapMarkerAlt size="14" />
                </Box>
                <Text color={textColor} fontSize="sm">
                  123 Food Street<br />
                  Culinary Home, NL, 2041RE
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </SimpleGrid>
      </Container>

      {/* Bottom Bar with Social Icons */}
      <Box borderTop="1px solid" borderColor={borderColor}>
        <Container maxW="container.xl" py={6}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Text fontSize="sm" color={textColor}>
              © 2024 Romy Hub Recipes. All rights reserved. Made with ❤️ for food monsters.
            </Text>
            <HStack spacing={4}>
              <Text fontSize="sm" color={textColor}>Follow us:</Text>
              <HStack spacing={2}>
                <IconButton
                  as="a"
                  href="https://github.com"
                  target="_blank"
                  aria-label="GitHub"
                  icon={<FaGithub />}
                  size="sm"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  _hover={{ bg: "whiteAlpha.200" }}
                />
                <IconButton
                  as="a"
                  href="https://linkedin.com"
                  target="_blank"
                  aria-label="LinkedIn"
                  icon={<FaLinkedin />}
                  size="sm"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  _hover={{ bg: "whiteAlpha.200" }}
                />
                <IconButton
                  as="a"
                  href="https://facebook.com"
                  target="_blank"
                  aria-label="Facebook"
                  icon={<FaFacebook />}
                  size="sm"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  _hover={{ bg: "whiteAlpha.200" }}
                />
                <IconButton
                  as="a"
                  href="https://instagram.com"
                  target="_blank"
                  aria-label="Instagram"
                  icon={<FaInstagram />}
                  size="sm"
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  _hover={{ bg: "whiteAlpha.200" }}
                />
              </HStack>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

/* =========================
   APP
   ========================= */
function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Hero />
        <Box flex="1">
          <RecipesOverview />
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
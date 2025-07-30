import { faker } from '@faker-js/faker';
import fs from 'fs';

function randomArray(arr, min = 1, max = arr.length) {
  const count = faker.number.int({ min, max });
  return faker.helpers.shuffle(arr).slice(0, count);
}

const intents = ['looking-for-flat', 'looking-for-flatmate', 'have-flat-need-flatmate'];
const userTypes = ['student', 'professional', 'owner'];
const genders = ['male', 'female', 'any'];
const locations = ['Gachibowli, Hyderabad', 'Madhapur, Hyderabad', 'Kondapur, Hyderabad', 'Banjara Hills, Hyderabad'];
const habitsList = ['Clean', 'Night Owl', 'Early Riser', 'Social', 'Calm', 'Organized'];
const amenitiesList = ['WiFi', 'AC', 'Parking', 'Washing Machine', 'Gym', 'TV'];
const restrictionsList = ['No smoking indoors', 'No pets', 'No loud music'];
const tagsList = ['Techie', 'Friendly', 'Hyderabad', 'Calm', 'Social', 'Student', 'Professional'];

const profiles = Array.from({ length: 40 }).map(() => {
  const futureDate = faker.date.future({ years: 1 });
  const moveInDate = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(futureDate);

  return {
    name: faker.person.fullName(),
    age: faker.number.int({ min: 20, max: 35 }),
    avatar: faker.image.avatar(),
    isVerified: faker.datatype.boolean(),
    lastActive: `${faker.number.int({ min: 1, max: 120 })} minutes ago`,
    userType: faker.helpers.arrayElement(userTypes),
    intent: faker.helpers.arrayElement(intents),
    gender: faker.helpers.arrayElement(genders),
    college: faker.company.name(),
    course: 'B.Tech in ' + faker.commerce.department(),
    year: 'Graduated',
    company: faker.company.name(),
    jobTitle: faker.person.jobTitle(),
    workLocation: faker.helpers.arrayElement(locations),
    location: faker.helpers.arrayElement(locations),
    budget: `₹${faker.number.int({ min: 15, max: 35 })}000 - ₹${faker.number.int({ min: 40, max: 50 })}000`,
    roomType: faker.helpers.arrayElement(['Single Room', 'Shared Room']),
    moveInDate,
    stayDuration: faker.datatype.boolean() ? '1 year or more' : '6 months',
    phone: faker.phone.number('+91##########'),
    email: faker.internet.email().toLowerCase(),
    description: faker.lorem.sentences(2),
    habits: randomArray(habitsList, 2, 4),
    amenities: randomArray(amenitiesList, 2, 4),
    restrictions: randomArray(restrictionsList, 1, 2),
    verifications: {
      phone: faker.datatype.boolean(),
      email: faker.datatype.boolean(),
      college: faker.datatype.boolean(),
      identity: faker.datatype.boolean()
    },
    type: faker.helpers.arrayElement(['flatmate', 'flat']),
    image: faker.image.avatar(),
    tags: randomArray(tagsList, 2, 4),
    compatibility: faker.number.int({ min: 50, max: 100 })
  };
});

fs.writeFileSync('mockProfiles40.json', JSON.stringify(profiles, null, 2));
console.log('✅ mockProfiles40.json created with 40 mock user profiles.');

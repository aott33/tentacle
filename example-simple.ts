import {
  createTentacle,
  PlcMqtts,
  PlcSources,
  PlcVariableNumber,
} from "./index.ts";

type Mqtts = PlcMqtts;
type Sources = PlcSources;
type Variables = {
  count: PlcVariableNumber;
  temperature: PlcVariableNumber;
  pressure: PlcVariableNumber;
};

const main = await createTentacle<Mqtts, Sources, Variables>({
  tasks: {
    main: {
      name: "main",
      description: "The main task",
      scanRate: 1000,
      program: (variables, setVar) => {
        setVar("count", variables.count.value + 1);
        setVar("temperature", 20 + Math.random() * 5);
        setVar("pressure", 100 + Math.random() * 10);
      },
    },
  },
  mqtt: {},
  sources: {},
  variables: {
    count: {
      id: "count",
      description: "Keeps count of how many times the main task has run",
      datatype: "number",
      default: 0,
      decimals: 0,
    },
    temperature: {
      id: "temperature",
      description: "Simulated temperature reading",
      datatype: "number",
      default: 20,
      decimals: 2,
    },
    pressure: {
      id: "pressure",
      description: "Simulated pressure reading",
      datatype: "number",
      default: 100,
      decimals: 1,
    },
  },
});

console.log("\n🚀 Tentacle PLC running!");
console.log("📊 GraphQL Playground: http://localhost:4123/graphql\n");
console.log("Test variableIds filtering with these queries:\n");
console.log("1️⃣  Single variable:");
console.log('   { plc(variableIds: ["count"]) { runtime { variables { id value } } } }\n');
console.log("2️⃣  Multiple variables:");
console.log('   { plc(variableIds: ["count", "temperature"]) { runtime { variables { id value } } } }\n');
console.log("3️⃣  All variables (no filter):");
console.log('   { plc { runtime { variables { id value } } } }\n');
console.log("4️⃣  Invalid ID (returns empty):");
console.log('   { plc(variableIds: ["invalid"]) { runtime { variables { id value } } } }\n');

main();
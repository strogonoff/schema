import { pipe } from "@effect/data/Function"
// import * as D from "@effect/io/Debug"
import * as S from "@effect/schema/Schema"
import * as Benchmark from "benchmark"
import { z } from "zod"

/*
schema (good) x 107,508 ops/sec ±0.47% (87 runs sampled)
zod (good) x 407,693 ops/sec ±6.17% (77 runs sampled)
schema (bad) x 104,383 ops/sec ±2.04% (88 runs sampled)
zod (bad) x 102,018 ops/sec ±5.56% (79 runs sampled)
*/

const suite = new Benchmark.Suite()

const UserZod = z.object({
  name: z.string().min(3).max(20),
  age: z.number().min(0).max(120),
  address: z.object({
    street: z.string().min(3).max(200),
    number: z.number().min(0).max(120),
    city: z.string().min(3).max(200),
    country: z.string().min(3).max(200),
    zip: z.string().min(3).max(200)
  })
}).strict()

const schema = S.struct({
  name: pipe(S.string, S.minLength(3), S.maxLength(20)),
  age: pipe(S.number, S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(120)),
  address: S.struct({
    street: pipe(S.string, S.minLength(3), S.maxLength(200)),
    number: pipe(S.number, S.greaterThanOrEqualTo(0), S.lessThanOrEqualTo(120)),
    city: pipe(S.string, S.minLength(3), S.maxLength(200)),
    country: pipe(S.string, S.minLength(3), S.maxLength(200)),
    zip: pipe(S.string, S.minLength(3), S.maxLength(200))
  })
})

const good = {
  name: "Joe",
  age: 13,
  address: {
    street: "Main Street",
    number: 12,
    city: "New York",
    country: "USA",
    zip: "12345"
  }
}

const bad = {
  name: "Jo",
  age: 13,
  address: {
    street: "Main Street",
    number: 12,
    city: "New York",
    country: "USA",
    zip: "12345"
  }
}

const parseEither = S.parseEither(schema)
const options = { allErrors: true }

// console.log(UserZod.safeParse(good))
// console.log(parseEither(good))
// console.log(JSON.stringify(UserZod.safeParse(bad), null, 2))
// console.log(JSON.stringify(parseEither(bad), null, 2))

suite
  .add("schema (good)", function() {
    parseEither(good, options)
  })
  .add("zod (good)", function() {
    UserZod.safeParse(good)
  })
  .add("schema (bad)", function() {
    parseEither(bad, options)
  })
  .add("zod (bad)", function() {
    UserZod.safeParse(bad)
  })
  .on("cycle", function(event: any) {
    console.log(String(event.target))
  })
  .on("complete", function(this: any) {
    console.log("Fastest is " + this.filter("fastest").map("name"))
  })
  .run({ async: true })

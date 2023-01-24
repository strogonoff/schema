import { pipe } from "@fp-ts/core/Function"
import * as _ from "@fp-ts/schema/data/filter"
import * as P from "@fp-ts/schema/Parser"
import * as S from "@fp-ts/schema/Schema"

describe.concurrent("endsWith", () => {
  it("Guard", () => {
    const schema = pipe(S.string, S.endsWith("a"))
    const is = P.is(schema)
    expect(is("a")).toEqual(true)
    expect(is("ba")).toEqual(true)

    expect(is("")).toEqual(false)
    expect(is("b")).toEqual(false)
  })
})
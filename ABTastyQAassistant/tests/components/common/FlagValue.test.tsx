import React from "react";
import { render } from "@testing-library/react-native";
import { FlagValue } from "../../../src/components/common/FlagValue";

describe("FlagValue Component", () => {
  it("should render null for invalid modification types", () => {
    // Undefined
    expect(render(<FlagValue modifications={undefined} />).toJSON()).toBeNull();

    // Null
    expect(
      render(<FlagValue modifications={null as any} />).toJSON(),
    ).toBeNull();

    // Array
    expect(
      render(<FlagValue modifications={[1, 2, 3] as any} />).toJSON(),
    ).toBeNull();

    // Primitive string
    expect(
      render(<FlagValue modifications={"string" as any} />).toJSON(),
    ).toBeNull();
  });

  it("should render object modifications", () => {
    const modifications = {
      key1: "value1",
      key2: "value2",
    };
    const { toJSON, getByText } = render(
      <FlagValue modifications={modifications} />,
    );
    const tree = toJSON();
    expect(tree).toMatchSnapshot();
    expect(getByText("key1")).toBeTruthy();
    expect(getByText("value1")).toBeTruthy();
    expect(getByText("key2")).toBeTruthy();
    expect(getByText("value2")).toBeTruthy();
  });

  it("should format primitive values correctly", () => {
    // String
    const stringTree = render(
      <FlagValue modifications={{ stringKey: "test string" }} />,
    ).toJSON();
    expect(stringTree).toMatchSnapshot();
    expect(JSON.stringify(stringTree)).toContain("test string");

    // Number
    const numberTree = render(
      <FlagValue modifications={{ numberKey: 42 }} />,
    ).toJSON();
    expect(numberTree).toMatchSnapshot();
    expect(JSON.stringify(numberTree)).toContain("42");

    // Boolean true
    const boolTrueTree = render(
      <FlagValue modifications={{ boolKey: true }} />,
    ).toJSON();
    expect(boolTrueTree).toMatchSnapshot();
    expect(JSON.stringify(boolTrueTree)).toContain("true");

    // Boolean false
    const boolFalseTree = render(
      <FlagValue modifications={{ boolKey: false }} />,
    ).toJSON();
    expect(boolFalseTree).toMatchSnapshot();
    expect(JSON.stringify(boolFalseTree)).toContain("false");

    // Null value
    const nullTree = render(
      <FlagValue modifications={{ nullKey: null }} />,
    ).toJSON();
    expect(nullTree).toMatchSnapshot();
    expect(JSON.stringify(nullTree)).toContain("null");
  });

  it("should format array value as JSON", () => {
    const modifications = { arrayKey: [1, 2, 3] };
    const { toJSON, getByText } = render(
      <FlagValue modifications={modifications} />,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText("arrayKey")).toBeTruthy();
    expect(getByText(JSON.stringify([1, 2, 3], null, 0))).toBeTruthy();
  });

  it("should format nested object as JSON", () => {
    const modifications = {
      objectKey: { nested: "value", count: 5 },
    };
    const { toJSON, getByText } = render(
      <FlagValue modifications={modifications} />,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText("objectKey")).toBeTruthy();
    expect(getByText('{\n  "nested": "value",\n  "count": 5\n}')).toBeTruthy();
  });

  it("should render multiple key-value pairs", () => {
    const modifications = {
      flag1: true,
      flag2: "enabled",
      flag3: 100,
    };
    const { toJSON, getByText } = render(<FlagValue modifications={modifications} />);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText("flag1")).toBeTruthy();
    expect(getByText("true")).toBeTruthy();
    expect(getByText("flag2")).toBeTruthy();
    expect(getByText("enabled")).toBeTruthy();
    expect(getByText("flag3")).toBeTruthy();
    expect(getByText("100")).toBeTruthy();
  });

  it("should render empty object", () => {
    const modifications = {};
    const { toJSON } = render(<FlagValue modifications={modifications} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

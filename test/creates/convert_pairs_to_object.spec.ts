import { describe, appTester, App } from "../helpers";

describe("Convert Key-Value pairs to Object", () => {
  it("should create a Object", async () => {
    const bundle = {
      inputData: {
        keyProperty: "name",
        valueProperty: "value",
        entries: [
          "{'name': 'Book Type', 'value': 'Softcover'}",
          "{'name': 'Number of Pets', 'value': '3'}",
          "{'name': 'Number of Owners', 'value': '3'}",
          "{'name': 'Pet Type', 'value': 'Dog'}",
          "{'name': 'Dog Breed', 'value': 'Australian Shepherd, Regular Tail'}",
          "{'name': 'Australian Shepherd', 'value': 'Australian Shepherd 19'}",
          "{'name': 'Pet Name', 'value': 'Bella'}",
          "{'name': 'Pet Gender', 'value': 'Female'}",
          "{'name': 'Pet 2 - Pet Type', 'value': 'Dog'}",
          "{'name': 'Pet 2 - Dog Breed', 'value': 'Weimaraner'}",
          "{'name': 'Weimeraner 1', 'value': 'Weimeraner'}",
          "{'name': 'Pet 2 - Name', 'value': 'Nela'}",
          "{'name': 'Pet 2 - Gender', 'value': 'Female'}",
          "{'name': 'Pet 3 - Pet Type', 'value': 'Cat'}",
          "{'name': 'Pet 3 - Cat Breed', 'value': 'Exotic'}",
          "{'name': 'Exotic 2', 'value': 'Exotic'}",
          "{'name': 'Pet 3 - Name', 'value': 'Lumit'}",
          "{'name': 'Pet 3 - Gender', 'value': 'Male'}",
          "{'name': 'Owner ', 'value': 'Vera'}",
          "{'name': 'Second Owner', 'value': 'Anna'}",
          "{'name': 'Third Owner', 'value': 'Lari'}",
          "{'name': 'Hometown', 'value': 'Texas'}",
          "{'name': 'Dedication (Optional)', 'value': ''}",
          "{'name': 'Add A Dedication Photo? (Optional)', 'value': ''}",
          "{'name': '_boldVariantNames', 'value': '3'}",
          "{'name': '_boldVariantIds', 'value': '20003766370415'}",
          "{'name': '_boldProductIds', 'value': '2119027327087'}",
          "{'name': '_boldVariantPrices', 'value': '2499'}",
          "{'name': '_boldBuilderId', 'value': '1621981184'}",
        ],
      },
    };

    const response = await appTester(
      App.creates["convert_pairs_to_object"].operation.perform,
      bundle,
    );
    expect(response).toEqual({
      "Book Type": "Softcover",
      "Number of Pets": "3",
      "Number of Owners": "3",
      "Pet Type": "Dog",
      "Dog Breed": "Australian Shepherd, Regular Tail",
      "Australian Shepherd": "Australian Shepherd 19",
      "Pet Name": "Bella",
      "Pet Gender": "Female",
      "Pet 2 - Pet Type": "Dog",
      "Pet 2 - Dog Breed": "Weimaraner",
      "Weimeraner 1": "Weimeraner",
      "Pet 2 - Name": "Nela",
      "Pet 2 - Gender": "Female",
      "Pet 3 - Pet Type": "Cat",
      "Pet 3 - Cat Breed": "Exotic",
      "Exotic 2": "Exotic",
      "Pet 3 - Name": "Lumit",
      "Pet 3 - Gender": "Male",
      "Owner ": "Vera",
      "Second Owner": "Anna",
      "Third Owner": "Lari",
      Hometown: "Texas",
      "Dedication (Optional)": "",
      "Add A Dedication Photo? (Optional)": "",
      _boldVariantNames: "3",
      _boldVariantIds: "20003766370415",
      _boldProductIds: "2119027327087",
      _boldVariantPrices: "2499",
      _boldBuilderId: "1621981184",
    });
  });
});

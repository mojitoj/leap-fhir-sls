const _ = require("lodash");
const { label } = require("../../lib/labeling/labeler");

const OBSERVATION = require("../fixtures/observations/observations-ketamine.json");
const NON_SENSITIVE_OBSERVATION = require("../fixtures/observations/observation-bacteria.json");

const BUNDLE = require("../fixtures/empty-bundle.json");

it("correctly labels an unlabeled resource", async () => {
  const labeledObservation = await label(OBSERVATION);
  expect(labeledObservation.meta?.security).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        extension: expect.arrayContaining([
          {
            url: "http://hl7.org/fhir/uv/security-label-ds4p/StructureDefinition/extension-sec-label-basis",
            valueCoding: {
              system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
              code: "42CFRPart2",
              display: "42 CFR Part2"
            }
          },
          {
            url: "http://hl7.org/fhir/uv/security-label-ds4p/StructureDefinition/extension-sec-label-basis",
            valueCoding: { code: "ketamine", system: "sample-rule-1" }
          }
        ]),
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "SUD",
        display: "substance use disorder information sensitivity"
      }),
      expect.objectContaining({
        extension: expect.arrayContaining([
          {
            url: "http://hl7.org/fhir/uv/security-label-ds4p/StructureDefinition/extension-sec-label-basis",
            valueCoding: {
              system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
              code: "42CFRPart2",
              display: "42 CFR Part2"
            }
          }
        ]),
        system: "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        code: "R",
        display: "restricted"
      })
    ])
  );
});

it("correctly refrains from labeling a non-sensitiveresource", async () => {
  const labeledObservation = await label(NON_SENSITIVE_OBSERVATION);
  expect(labeledObservation.meta?.security).toEqual([]);
});

it("does not add redundant labels to a resource with existing labels", async () => {
  const alreadyLabeledObservation = _.cloneDeep(OBSERVATION);
  alreadyLabeledObservation.meta = {
    security: [
      {
        code: "SUD",
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode"
      }
    ]
  };

  const labeledObservation = await label(alreadyLabeledObservation);
  expect(labeledObservation.meta?.security).toHaveLength(2);
  expect(labeledObservation.meta?.security).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "SUD"
      }),
      expect.objectContaining({
        system: "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        code: "R"
      })
    ])
  );
});

it("correctly adds labels to a resource with existing labels", async () => {
  const alreadyLabeledObservation = _.cloneDeep(OBSERVATION);
  alreadyLabeledObservation.meta = {
    security: [
      {
        code: "HRELIABLE",
        system: "http://terminology.hl7.org/CodeSystem/v3-ObservationValue"
      }
    ]
  };

  const labeledObservation = await label(alreadyLabeledObservation);
  expect(labeledObservation.meta?.security).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "SUD"
      }),
      expect.objectContaining({
        system: "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
        code: "HRELIABLE"
      })
    ])
  );
});

it("correctly labels a bundle of resource", async () => {
  const bundleOfObservations = _.cloneDeep(BUNDLE);
  bundleOfObservations.entry = [
    { fullUrl: "1", resource: OBSERVATION },
    { fullUrl: "2", resource: OBSERVATION }
  ];
  bundleOfObservations.total = 2;

  const labeledBundle = await label(bundleOfObservations);
  expect(labeledBundle.entry[0].resource.meta?.security).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "SUD"
      }),
      expect.objectContaining({
        system: "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        code: "R"
      })
    ])
  );
  expect(labeledBundle.entry[1].resource.meta?.security).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "SUD"
      }),
      expect.objectContaining({
        system: "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        code: "R"
      })
    ])
  );
});

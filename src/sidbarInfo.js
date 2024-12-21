export const sideBarTreeArray = {
  amf1a: [
    {
      id: "overview1a",
      label: "Overview",
      apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator1/",
        "http://14.96.26.26:8080/api/p1_amfs_outgoing1/",
        "http://14.96.26.26:8080/api/p1_amfs_apfc1/",
      ],
    },
    {
      id: "dg_1",
      label: "DG-1",
    },
    {
      id: "tf_1",
      label: "Transformer-1",
    },
    {
      id: "apfc_1",
      label: "APFC-1",
    },
    {
      id: "og_1",
      label: "OG-1",
    },
    {
      id: "cell_pcc_panel_1_incomer",
      label: "Cell Pcc Panel-1 Incomer",
      children: [
        {
          id: "PCC1Overview",
          label: "PCC Panel 1 Overview",
        },
        {
          id: "ups",
          label: "UPS",
          children: [
            { id: "ups-1a", label: "UPS-1A" },
            { id: "ups-1b", label: "UPS-1B" },
            { id: "ups-1c", label: "UPS-1C" },
            { id: "ups-1d", label: "UPS-1D" },
            { id: "ups-1e", label: "UPS-1E" },
          ],
        },
        {
          id: "og cell lt panel-1",
          label: "OG Cell LT Panel-1",
          children: [
            {
              id: "cell lt-1 incomer",
              label: "Cell LT-1 Incomer",
            },
          ],
        },
        {
          id: "og cell tool pdb-1",
          label: "OG Cell Tool PDB-1",
          children: [
            {
              id: "cell tool pdb-1 incomer",
              label: "Cell Tool PDB-1 Incomer",
            },
          ],
        },
        {
          id: "chiller-2",
          label: "Chiller-2",
        },
      ],
    },
  ],
  amf1b: [
    {
      id: "",
      label: "Overview",
      apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator1/",
        "http://14.96.26.26:8080/api/p1_amfs_outgoing1/",
        "http://14.96.26.26:8080/api/p1_amfs_apfc1/",
      ],
    },
    {
      id: "dg-2",
      label: "DG-2",
    },
    {
      id: "tf-2",
      label: "Transformer-2",
    },
    {
      id: "apfc-2",
      label: "APFC-2",
    },
    {
      id: "og-2",
      label: "OG-2",
    },
    {
      id: "cell pcc panel-2 incomer",
      label: "Cell Pcc Panel-2 Incomer",
      children: [
        {
          id: "ups_amf1b",
          label: "UPS",
          children: [
            { id: "ups_2a", label: "UPS-2A" },
            { id: "ups_2b", label: "UPS-2B" },
            { id: "ups_2c", label: "UPS-2C" },
            { id: "ups_2d", label: "UPS-2D" },
            { id: "ups_2e", label: "UPS-2E" },
          ],
        },
        {
          id: "og cell lt panel-2",
          label: "OG Cell LT Panel-2",
          children: [
            {
              id: "cell lt-2 incomer",
              label: "Cell LT-2 Incomer",
            },
          ],
        },
        {
          id: "og cell tool pdb-2",
          label: "OG Cell Tool PDB-2",
          children: [
            {
              id: "cell tool pdb-2 incomer",
              label: "Cell Tool PDB-2 Incomer",
            },
          ],
        },
        {
          id: "chiller_2",
          label: "Chiller-2",
        },
      ],
    },
  ],
};

const apiUrls = {
  overview1a: {
    apiUrl: [
      {
        p1_amfs_Solar: "http://14.96.26.26:8080/api/p1_amfs_outgoing1/",
        p1_amfs_transformer2:
          "http://14.96.26.26:8080/api/p1_amfs_transformer2/",
        p1_amfs_generator2: "http://14.96.26.26:8080/api/p1_amfs_generator2/",
      },
    ],
  },

  ups_2c: {
    apiUrl: "http://14.96.26.26:8080/api/p1_ups2_incomer2c/",
  },
};

export default { sideBarTreeArray, apiUrls };

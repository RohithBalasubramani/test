export const sideBarTreeArray = {
  amf1a: [
    {
      id: "overview",
      label: "Overview",
      apis: ["http://14.96.26.26:8080/api/p1_pepplht_outgoing1/"],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator1/",
        "http://14.96.26.26:8080/api/p1_amfs_outgoing1/",
        "http://14.96.26.26:8080/api/p1_amfs_apfc1/",
      ],
    },
    {
      id: "dg_1",
      label: "DG-1",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_generator1/"],
    },
    {
      id: "tf_1",
      label: "Transformer-1",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_transformer1/"],
    },
    {
      id: "apfc_1",
      label: "APFC-1",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_apfc1/"],
    },
    {
      id: "og_1",
      label: "OG-1",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_outgoing1/"],
    },
    {
      id: "cell_pcc_panel_1_incomer",
      label: "Cell PCC Panel-1 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_pcc1_cellincomer/"],
      children: [
        {
          id: "cell_pcc_panel_1_incomer_overview",
          label: "Cell PCC Panel-1 Incomer Overview",
          apis: [
            "http://14.96.26.26:8080/api/p1_amfs_generator1/",
            "http://14.96.26.26:8080/api/p1_amfs_transformer1/",
          ],
          feeder_apis: [
            "http://14.96.26.26:8080/api/p1_pcc1_ups1a/",
            "http://14.96.26.26:8080/api/p1_pcc1_ups1b/",
            "http://14.96.26.26:8080/api/p1_pcc1_ups1c/",
            "http://14.96.26.26:8080/api/p1_pcc1_ups1d/",
            "http://14.96.26.26:8080/api/p1_pcc1_ups1e/",
            "http://14.96.26.26:8080/api/p1_pcc1_ltp1/",
            "http://14.96.26.26:8080/api/p1_pcc1_ltp2/",
            "http://14.96.26.26:8080/api/p1_pcc1_chiller2/",
          ],
        },
        {
          id: "ups_1",
          label: "UPS Overview",
          apis: [
            "http://14.96.26.26:8080/api/p1_pcc1_ups1a/",
            "http://14.96.26.26:8080/api/p1_pcc1_ups1b/",
            "http://14.96.26.26:8080/api/p1_pcc1_ups1c/",
            "http://14.96.26.26:8080/api/p1_pcc1_ups1d/",
            "http://14.96.26.26:8080/api/p1_pcc1_ups1e/",
          ],
          feeder_apis: [
            "http://14.96.26.26:8080/api/p1_ups1_incomer1a/",
            "http://14.96.26.26:8080/api/p1_ups1_incomer1b/",
            "http://14.96.26.26:8080/api/p1_ups1_incomer1c/",
            "http://14.96.26.26:8080/api/p1_ups1_incomer1d/",
            "http://14.96.26.26:8080/api/p1_ups1_incomer1e/",
          ],
          children: [
            {
              id: "ups_1a",
              label: "UPS-1A",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ups1a/"],
            },
            {
              id: "ups_1b",
              label: "UPS-1B",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ups1b/"],
            },
            {
              id: "ups_1c",
              label: "UPS-1C",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ups1c/"],
            },
            {
              id: "ups_1d",
              label: "UPS-1D",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ups1d/"],
            },
            {
              id: "ups_1e",
              label: "UPS-1E",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ups1e/"],
            },
            {
              id: "ups1_incomer1a",
              label: "UPS-1A-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_incomer1a/"],
            },
            {
              id: "ups1_incomer1b",
              label: "UPS-1B-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_incomer1b/"],
            },
            {
              id: "ups1_incomer1c",
              label: "UPS-1C-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_incomer1c/"],
            },
            {
              id: "ups1_incomer1d",
              label: "UPS-1D-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_incomer1d/"],
            },
            {
              id: "ups1_incomer1e",
              label: "UPS-1E-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_incomer1e/"],
            },
            {
              id: "ups1_og1a",
              label: "UPS-1A-OG1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_og1a/"],
            },
            {
              id: "ups1_og1b",
              label: "UPS-1B-OG1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_og1b/"],
            },
            {
              id: "ups1_og1c",
              label: "UPS-1C-OG1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_og1c/"],
            },
            {
              id: "ups1_og1d",
              label: "UPS-1D-OG1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_og1d/"],
            },
            {
              id: "ups1_og1e",
              label: "UPS-1E-OG1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_og1e/"],
            },
            {
              id: "ups1_ogsection1",
              label: "OG USP Section-1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_ogsection1/"],
            },
            {
              id: "ups1_ogsection2",
              label: "OG USP Section-2",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_ogsection2/"],
            },
            {
              id: "ups1lt1",
              label: "UPS-1 LT Panel-1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1lt1_incomerog3f2/"],
            },
            {
              id: "ups1lt2",
              label: "UPS-1 LT Panel-2",
              apis: ["http://14.96.26.26:8080/api/p1_ups1lt2_incomerog4f2/"],
            },
            {
              id: "ups1lt1_panel1pcw",
              label: "UPS-1 LT Panel-1 PCW",
              apis: ["http://14.96.26.26:8080/api/p1_ups1lt1_panel1pcw/"],
            },
          ],
        },
        {
          id: "og_cell_lt_panel-1",
          label: "OG Cell LT Panel-1",
          apis: ["http://14.96.26.26:8080/api/p1_pcc1_ltp1/"],
          children: [
            {
              id: "og_cell_lt_panel-1_overview",
              label: "OG Cell LT Panel-1 Overview",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ltp1/"],
              feeder_apis: [
                "http://14.96.26.26:8080/api/p1_cellltp1_hotwatertank1/",
                "http://14.96.26.26:8080/api/p1_cellltp1_hotwatertank2/",
                "http://14.96.26.26:8080/api/p1_celltoolltp1_alox1/",
                "http://14.96.26.26:8080/api/p1_celltoolltp1_alox2/",
                "http://14.96.26.26:8080/api/p1_celltoolltp1_alox3/",
              ],
            },
            {
              id: "cellltp1_hotwatertank1",
              label: "Hot Water Tank-1",
              apis: ["http://14.96.26.26:8080/api/p1_cellltp1_hotwatertank1/"],
            },
            {
              id: "cellltp1_hotwatertank2",
              label: "Hot Water Tank-2",
              apis: ["http://14.96.26.26:8080/api/p1_cellltp1_hotwatertank2/"],
            },
            {
              id: "celltoolltp1_alox1",
              label: "ALOX PECVD Machine-1",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox1/"],
            },
            {
              id: "celltoolltp1_alox2",
              label: "ALOX PECVD Machine-2",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox2/"],
            },
            {
              id: "celltoolltp1_alox3",
              label: "ALOX PECVD Machine-3",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox3/"],
            },
            {
              id: "cell_lt-1_incomer",
              label: "Cell LT-1 Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_incomer/"],
            },
          ],
        },
        {
          id: "og_cell_tool_pdb-1",
          label: "OG Cell Tool PDB-1",
          apis: ["http://14.96.26.26:8080/api/p1_pcc1_ltp2/"],
          children: [
            {
              id: "og_cell_tool_pdb-1_overview",
              label: "OG Cell Tool PDB-1 Overview",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ltp2/"],
              feeder_apis: [
                "http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion1/",
                "http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion2/",
                "http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion3/",
              ],
            },
            {
              id: "cell_tool_pdb-1_incomer",
              label: "Cell Tool PDB-1 Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_incomer/"],
            },
            {
              id: "celltoolpdb1_diffusion1",
              label: "Diffusion-1",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion1/"],
            },
            {
              id: "celltoolpdb1_diffusion2",
              label: "Diffusion-2",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion2/"],
            },
            {
              id: "celltoolpdb1_diffusion3",
              label: "Diffusion-3",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion3/"],
            },
          ],
        },
        {
          id: "chiller-2",
          label: "Chiller-2",
          apis: ["http://14.96.26.26:8080/api/p1_pcc1_chiller2/"],
        },
      ],
    },
  ],

  amf1b: [],
  amf2a: [],
  amf2b: [],

  inverters: [
    // Inverters from inverter1 to inverter17
    {
      id: "overview_inverter_p1",
      label: "Overview",
      apis: [],
    },
    ...Array.from({ length: 17 }, (_, i) => ({
      id: `inverter${i + 1}`,
      label: `Inverter-${i + 1}`,
      apis: [`http://14.96.26.26:8080/api/p1_inverter${i + 1}/`],
    })),
  ],
};

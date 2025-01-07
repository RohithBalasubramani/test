export const sideBarTreeArray = {
  amf1a: [
    {
      id: "overview",
      label: "Overview",
      apis: ["http://14.96.26.26:8080/api/p1_pepplht_outgoing1/"],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator1/",
        "http://14.96.26.26:8080/api/p1_amfs_transformer1/",
        "http://14.96.26.26:8080/api/p1_amfs_outgoing1/",
        "http://14.96.26.26:8080/api/p1_amfs_apfc1/",
      ],
    },
    {
      id: "p1_amfs_generator1",
      label: "DG-1",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_generator1/"],
    },
    {
      id: "p1_amfs_transformer1",
      label: "Transformer-1",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_transformer1/"],
    },
    {
      id: "p1_amfs_apfc1",
      label: "APFC-1",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_apfc1/"],
    },
    {
      id: "p1_amfs_outgoing1",
      label: "OG-1",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_outgoing1/"],
    },
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
      children: [
        {
          id: "p1_cell_pcc_panel_1_incomer",
          label: "Cell PCC Panel-1 Incomer",
          apis: ["http://14.96.26.26:8080/api/p1_pcc1_cellincomer/"],
        },
        {
          id: "ups_1_overview",
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
              id: "p1_pcc1_ups1a",
              label: "UPS-1A",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ups1a/"],
            },
            {
              id: "p1_pcc1_ups1b",
              label: "UPS-1B",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ups1b/"],
            },
            {
              id: "p1_pcc1_ups1c",
              label: "UPS-1C",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ups1c/"],
            },
            {
              id: "p1_pcc1_ups1d",
              label: "UPS-1D",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ups1d/"],
            },
            {
              id: "p1_pcc1_ups1e",
              label: "UPS-1E",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ups1e/"],
            },
            {
              id: "p1_ups1_incomer1a",
              label: "UPS-1A-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_incomer1a/"],
            },
            {
              id: "p1_ups1_incomer1b",
              label: "UPS-1B-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_incomer1b/"],
            },
            {
              id: "p1_ups1_incomer1c",
              label: "UPS-1C-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_incomer1c/"],
            },
            {
              id: "p1_ups1_incomer1d",
              label: "UPS-1D-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_incomer1d/"],
            },
            {
              id: "p1_ups1_incomer1e",
              label: "UPS-1E-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_incomer1e/"],
            },
            {
              id: "p1_ups1_og1a",
              label: "UPS-1A-OG1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_og1a/"],
            },
            {
              id: "p1_ups1_og1b",
              label: "UPS-1B-OG1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_og1b/"],
            },
            {
              id: "p1_ups1_og1c",
              label: "UPS-1C-OG1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_og1c/"],
            },
            {
              id: "p1_ups1_og1d",
              label: "UPS-1D-OG1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_og1d/"],
            },
            {
              id: "p1_ups1_og1e",
              label: "UPS-1E-OG1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_og1e/"],
            },
            {
              id: "p1_ups1_ogsection1",
              label: "OG USP Section-1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_ogsection1/"],
            },
            {
              id: "p1_ups1_ogsection2",
              label: "OG USP Section-2",
              apis: ["http://14.96.26.26:8080/api/p1_ups1_ogsection2/"],
            },
            {
              id: "p1_ups1lt1",
              label: "UPS-1 LT Panel-1",
              apis: ["http://14.96.26.26:8080/api/p1_ups1lt1_incomerog3f2/"],
            },
            {
              id: "p1_ups1lt2",
              label: "UPS-1 LT Panel-2",
              apis: ["http://14.96.26.26:8080/api/p1_ups1lt2_incomerog4f2/"],
            },
            {
              id: "p1_ups1lt1_panel1pcw",
              label: "UPS-1 LT Panel-1 PCW",
              apis: ["http://14.96.26.26:8080/api/p1_ups1lt1_panel1pcw/"],
            },
          ],
        },
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
          children: [
            {
              id: "p1_og_cell_lt_panel-1",
              label: "OG Cell LT Panel-1",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ltp1/"],
            },
            {
              id: "p1_cellltp1_hotwatertank1",
              label: "Hot Water Tank-1",
              apis: ["http://14.96.26.26:8080/api/p1_cellltp1_hotwatertank1/"],
            },
            {
              id: "p1_cellltp1_hotwatertank2",
              label: "Hot Water Tank-2",
              apis: ["http://14.96.26.26:8080/api/p1_cellltp1_hotwatertank2/"],
            },
            {
              id: "p1_celltoolltp1_alox1",
              label: "ALOX PECVD Machine-1",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox1/"],
            },
            {
              id: "p1_celltoolltp1_alox2",
              label: "ALOX PECVD Machine-2",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox2/"],
            },
            {
              id: "p1_celltoolltp1_alox3",
              label: "ALOX PECVD Machine-3",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox3/"],
            },
            {
              id: "p1_celltoolltp1_incomer",
              label: "Cell LT-1 Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_incomer/"],
            },
          ],
        },
        {
          id: "og_cell_tool_pdb-1_overview",
          label: "OG Cell Tool PDB-1 Overview",
          apis: ["http://14.96.26.26:8080/api/p1_pcc1_ltp2/"],
          feeder_apis: [
            "http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion1/",
            "http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion2/",
            "http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion3/",
          ],
          children: [
            {
              id: "p1_og_cell_tool_pdb-1",
              label: "OG Cell Tool PDB-1",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ltp2/"],
            },
            {
              id: "p1_celltoolpdb1_incomer",
              label: "Cell Tool PDB-1 Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_incomer/"],
            },
            {
              id: "p1_celltoolpdb1_diffusion1",
              label: "Diffusion-1",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion1/"],
            },
            {
              id: "p1_celltoolpdb1_diffusion2",
              label: "Diffusion-2",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion2/"],
            },
            {
              id: "p1_celltoolpdb1_diffusion3",
              label: "Diffusion-3",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion3/"],
            },
          ],
        },
        {
          id: "p1_pcc1_chiller2",
          label: "Chiller-2",
          apis: ["http://14.96.26.26:8080/api/p1_pcc1_chiller2/"],
        },
      ],
    },
  ],

  amf1b: [
    {
      id: "overview",
      label: "Overview",
      apis: ["http://14.96.26.26:8080/api/p1_pepplht_outgoing2/"],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator2/",
        "http://14.96.26.26:8080/api/p1_amfs_transformer2/",
        "http://14.96.26.26:8080/api/p1_amfs_outgoing2/",
        "http://14.96.26.26:8080/api/p1_amfs_apfc2/",
      ],
    },

    {
      id: "p1_amfs_generator2",
      label: "DG-2",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_generator2/"],
    },
    {
      id: "p1_amfs_transformer2",
      label: "Transformer-2",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_transformer2/"],
    },
    {
      id: "p1_amfs_apfc2",
      label: "APFC-2",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_apfc2/"],
    },
    {
      id: "p1_amfs_outgoing2",
      label: "OG-2",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_outgoing2/"],
    },

    {
      id: "cell_pcc_panel_2_incomer_overview",
      label: "Cell PCC Panel-2 Incomer Overview",
      apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator2/",
        "http://14.96.26.26:8080/api/p1_amfs_transformer2//",
      ],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_pcc2_lighting/",
        "http://14.96.26.26:8080/api/p1_pcc2_ups2a/",
        "http://14.96.26.26:8080/api/p1_pcc2_ups2b/",
        "http://14.96.26.26:8080/api/p1_pcc2_ups2c/",
        "http://14.96.26.26:8080/api/p1_pcc2_ups2d/",
        "http://14.96.26.26:8080/api/p1_pcc2_ups2e/",
        "http://14.96.26.26:8080/api/p1_pcc2_ogcellltp2/",
        "http://14.96.26.26:8080/api/p1_pcc2_ogcelltoolpdb2/",
      ],
      children: [
        {
          id: "cell_pcc_panel_2_incomer",
          label: "Cell PCC Panel-2 Incomer",
          apis: [""],
        },
        {
          id: "ups_2",
          label: "UPS Overview",
          apis: [
            "http://14.96.26.26:8080/api/p1_pcc2_ups2a/",
            "http://14.96.26.26:8080/api/p1_pcc2_ups2b/",
            "http://14.96.26.26:8080/api/p1_pcc2_ups2c/",
            "http://14.96.26.26:8080/api/p1_pcc2_ups2d/",
            "http://14.96.26.26:8080/api/p1_pcc2_ups2e/",
          ],
          feeder_apis: [
            "http://14.96.26.26:8080/api/p1_ups2_incomer2a/",
            "http://14.96.26.26:8080/api/p1_ups2_incomer2b/",
            "http://14.96.26.26:8080/api/p1_ups2_incomer2c/",
            "http://14.96.26.26:8080/api/p1_ups2_incomer2d/",
            "http://14.96.26.26:8080/api/p1_ups2_incomer2e/",
          ],
          children: [
            {
              id: "p1_pcc2_ups2a",
              label: "UPS-2A",
              apis: ["http://14.96.26.26:8080/api/p1_pcc2_ups2a/"],
            },
            {
              id: "p1_pcc2_ups2b",
              label: "UPS-2B",
              apis: ["http://14.96.26.26:8080/api/p1_pcc2_ups2b/"],
            },
            {
              id: "p1_pcc2_ups2c",
              label: "UPS-2C",
              apis: ["http://14.96.26.26:8080/api/p1_pcc2_ups2c/"],
            },
            {
              id: "p1_pcc2_ups2d",
              label: "UPS-2D",
              apis: ["http://14.96.26.26:8080/api/p1_pcc2_ups2d/"],
            },
            {
              id: "p1_pcc2_ups2e",
              label: "UPS-2E",
              apis: ["http://14.96.26.26:8080/api/p1_pcc2_ups2e/"],
            },
            {
              id: "p1_ups2_incomer2a",
              label: "UPS 2A Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_incomer2a/"],
            },
            {
              id: "p1_ups2_incomer2b",
              label: "UPS-2B-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_incomer2b/"],
            },
            {
              id: "p1_ups2_incomer2c",
              label: "UPS-2C-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_incomer2c/"],
            },
            {
              id: "p1_ups2_incomer2d",
              label: "UPS-2D-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_incomer2d/"],
            },
            {
              id: "p1_ups2_incomer2e",
              label: "UPS-2E-Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_incomer2e/"],
            },
            {
              id: "p1_ups2_panel2a",
              label: "UPS-2A-OG2",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_panel2a/"],
            },
            {
              id: "p1_ups2_panel2b",
              label: "UPS-2B-OG2",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_panel2b/"],
            },
            {
              id: "p1_ups2_panel2c",
              label: "UPS-2C-OG2",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_panel2c/"],
            },
            {
              id: "p1_ups2_panel2d",
              label: "UPS-2D-OG2",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_panel2d/"],
            },
            {
              id: "p1_ups2_panel2e",
              label: "UPS-2E-OG2",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_panel2e/"],
            },

            {
              id: "p1_ups2_outgoingabc",
              label: "UPS-2 OUTGOING-1",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_outgoingabc/"],
            },
            {
              id: "p1_ups2_ltpincomer",
              label: "UPS-2 LT PANEL INCOMER",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_ltpincomer/"],
            },
          ],
        },
        {
          id: "Og_cell_lt_panel-2_overview",
          label: "OG Cell LT Panel-1 Overview",

          apis: ["http://14.96.26.26:8080/api/p1_pcc2_ogcellltp2/"],
          feeder_apis: [
            "http://14.96.26.26:8080/api/p1_cellltp2_sinxp1/",
            "http://14.96.26.26:8080/api/p1_cellltp2_sinxp2/",
            "http://14.96.26.26:8080/api/p1_cellltp2_sinxp4/",
          ],
          children: [
            {
              id: "p1_pcc2_ogcellltp2",
              label: "OG Cell LT Panel-2",
              apis: ["http://14.96.26.26:8080/api/p1_pcc2_ogcellltp2/"],
            },
            {
              id: "p1_cellltp2_incomertf2",
              label: "Cell LT PANEL-2 Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_cellltp2_incomertf2/"],
            },
            {
              id: "p1_cellltp2_sinxp1",
              label: "SINX PECVD MACHINE-1",
              apis: ["http://14.96.26.26:8080/api/p1_cellltp2_sinxp1/"],
            },
            {
              id: "p1_cellltp2_sinxp2",
              label: "SINX PECVD MACHINE-2",
              apis: ["http://14.96.26.26:8080/api/p1_cellltp2_sinxp2/"],
            },
            {
              id: "p1_cellltp2_sinxp4",
              label: "SINX PECVD MACHINE-4",
              apis: ["http://14.96.26.26:8080/api/p1_cellltp2_sinxp4/"],
            },
          ],
        },
        {
          id: "og_cell_tool_pdb-2_overview",
          label: "OG Cell Tool PDB-2 Overview",
          apis: ["http://14.96.26.26:8080/api/p1_pcc2_ogcelltoolpdb2/"],
          feeder_apis: [
            "http://14.96.26.26:8080/api/p1_celltoolpdb2_sinxp3/",
            "http://14.96.26.26:8080/api/p1_celltoolpdb2_spare/",
          ],
          children: [
            {
              id: "p1_pcc2_ogcelltoolpdb2",
              label: "OG Cell Tool PDB-2",
              apis: ["http://14.96.26.26:8080/api/p1_pcc2_ogcelltoolpdb2/"],
            },
            {
              id: "p1_celltoolpdb2_incomer",
              label: "Cell Tool PDB-2 Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb2_incomer/"],
            },
            {
              id: "p1_celltoolpdb2_sinxp3",
              label: "SINX PECVD MACHINE-3",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb2_sinxp3/"],
            },
            {
              id: "p1_celltoolpdb2_spare",
              label: "SPARE(9FC)",
              apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb2_spare/"],
            },
          ],
        },
      ],
    },
  ],

  amf2a: [
    {
      id: "overview",
      label: "Overview",
      apis: ["http://14.96.26.26:8080/api/p1_pepplht_outgoing2/"],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator3/",
        "http://14.96.26.26:8080/api/p1_amfs_transformer3/",
        "http://14.96.26.26:8080/api/p1_amfs_outgoing2/",
        "http://14.96.26.26:8080/api/p1_amfs_apfc2/",
      ],
    },
    {
      id: "p1_amfs_generator3",
      label: "DG-3",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_generator3/"],
    },
    {
      id: "p1_amfs_transformer3",
      label: "Transformer-3",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_transformer3/"],
    },
    {
      id: "ap1_amfs_apfc3",
      label: "APFC-3",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_apfc3/"],
    },
    {
      id: "p1_amfs_outgoing3",
      label: "OG-3",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_outgoing3/"],
    },
    {
      id: "cell_pcc_panel_3_incomer_overview",
      label: "Cell PCC Panel-3 Incomer Overview",
      apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator3/",
        "http://14.96.26.26:8080/api/p1_amfs_transformer3",
      ],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_pcc3_chiller3/",
        "http://14.96.26.26:8080/api/p1_pcc3_chiller4/",
        "http://14.96.26.26:8080/api/p1_pcc3_cellltp3/",
        "http://14.96.26.26:8080/api/p1_pcc3_solarincomer/",
        "http://14.96.26.26:8080/api/p1_pcc3_meetfp/",
        "http://14.96.26.26:8080/api/p1_pcc3_concentratoretp/",
        "http://14.96.26.26:8080/api/p1_pcc3_distream/",
        "http://14.96.26.26:8080/api/p1_pcc3_rinsestream/",
        "http://14.96.26.26:8080/api/p1_pcc3_concentratorstream/",
        "http://14.96.26.26:8080/api/p1_pcc3_mvr/",
        "http://14.96.26.26:8080/api/p1_pcc3_firehydrant/",
        "http://14.96.26.26:8080/api/p1_pcc3_dgexhaust/",
        "http://14.96.26.26:8080/api/p1_pcc3_exhaustutility/",
        "http://14.96.26.26:8080/api/p1_pcc3_scrubberexhaust/",
      ],

      children: [
        {
          id: "p1_pcc3_cellincomer",
          label: "Cell PCC Panel-3 Incomer",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_cellincomer/"],
        },
        {
          id: "p1_pcc3_chiller3",
          label: "CHILLER-3",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_chiller3/"],
        },
        {
          id: "p1_pcc3_chiller4",
          label: "CHILLER-4",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_chiller4/"],
        },
        {
          id: "p1_pcc3_cellltp3",
          label: "OG CELL LT PANEL-3",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_cellltp3/"],
        },
        {
          id: "p1_pcc3_solarincomer",
          label: "PCC3 SOLAR INCOMER",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_solarincomer/"],
        },
        {
          id: "p1_pcc3_meetfp",
          label: "MEE ATFT PLANT",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_meetfp/"],
        },
        {
          id: "p1_pcc3_concentratoretp",
          label: "CONCENTRATE ETP PLANT",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_concentratoretp/"],
        },
        {
          id: "p1_pcc3_distream",
          label: "DI STREAM",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_distream/"],
        },
        {
          id: "p1_pcc3_rinsestream",
          label: "RINSE STREAM",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_rinsestream/"],
        },
        {
          id: "p1_pcc3_concentratorstream",
          label: "CONCENTRATE STREAM",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_concentratorstream/"],
        },
        {
          id: "p1_pcc3_mvr",
          label: "MVR",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_mvr/"],
        },
        {
          id: "p1_pcc3_firehydrant",
          label: "FIRE HYDRANT",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_firehydrant/"],
        },
        {
          id: "p1_pcc3_dgexhaust",
          label: "DG EXHAUST",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_dgexhaust/"],
        },
        {
          id: "pcc3_exhaustutility",
          label: "EXHAUST UTILITY",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_exhaustutility/"],
        },
        {
          id: "p1_pcc3_scrubberexhaust",
          label: "SCRUBBER CIRCULATION & EXHAUST",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_scrubberexhaust/"],
        },
      ],
    },
    {
      id: "Og_cell_lt_panel-3_overview",
      label: "OG Cell LT Panel-3 Overview",

      apis: ["http://14.96.26.26:8080/api/p1_pcc3_cellltp3/"],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_cellltp3_aircompressor1/",
        "http://14.96.26.26:8080/api/p1_cellltp3_aircompressor2/",
        "http://14.96.26.26:8080/api/p1_cellltp3_aircompressor3/",
        "http://14.96.26.26:8080/api/p1_cellltp3_aircompressor4/",
      ],
      children: [
        {
          id: "P1_og_cell_lt_panel-3",
          label: "OG Cell LT Panel-3",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_cellltp3/"],
        },
        {
          id: "p1_cellltp3_incomer",
          label: "Cell LT PANEL-3 Incomer",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp3_incomer/"],
        },
        {
          id: "p1_cellltp3_aircompressor1",
          label: "AIR COMPRESSOR-1",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp3_aircompressor1/"],
        },
        {
          id: "p1_cellltp3_aircompressor2",
          label: "AIR COMPRESSOR-2",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp3_aircompressor2/"],
        },
        {
          id: "p1_cellltp3_aircompressor3",
          label: "AIR COMPRESSOR-3",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp3_aircompressor3/"],
        },
        {
          id: "p1_cellltp3_aircompressor4",
          label: "AIR COMPRESSOR-4",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp3_aircompressor4/"],
        },
      ],
    },
  ],

  amf2b: [
    {
      id: "overview",
      label: "Overview",
      apis: ["http://14.96.26.26:8080/api/p1_pepplht_outgoing4/"],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator4/",
        "http://14.96.26.26:8080/api/p1_amfs_transformer4/",
        "http://14.96.26.26:8080/api/p1_amfs_outgoing4/",
        "http://14.96.26.26:8080/api/p1_amfs_apfc4/",
      ],
    },
    {
      id: "p1_amfs_generator4",
      label: "DG-4",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_generator4/"],
    },
    {
      id: "p1_amfs_transformer4",
      label: "Transformer-2",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_transformer4/"],
    },
    {
      id: "p1_amfs_apfc4",
      label: "APFC-4",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_apfc4/"],
    },
    {
      id: "p1_amfs_outgoing4",
      label: "OG-4",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_outgoing4/"],
    },

    {
      id: "cell_pcc_panel_4_incomer_overview",
      label: "Cell PCC Panel-4 Incomer Overview",
      apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator4/",
        "http://14.96.26.26:8080/api/p1_amfs_transformer4/",
      ],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_pcc4_solarincomer/",
        "http://14.96.26.26:8080/api/p1_pcc4_chiller1/",
        "http://14.96.26.26:8080/api/p1_pcc4_coolingtower/",
        "http://14.96.26.26:8080/api/p1_pcc4_cellltp4/",
      ],

      children: [
        {
          id: "p1_pcc4_cellincomer",
          label: "Cell PCC Panel-4 Incomer",
          apis: ["http://14.96.26.26:8080/api/p1_pcc4_cellincomer/"],
        },
        {
          id: "p1_pcc4_solarincomer",
          label: "SOLAR INCOMER",
          apis: ["http://14.96.26.26:8080/api/p1_pcc4_solarincomer/"],
        },
        {
          id: "p1_pcc4_chiller1",
          label: "CHILLER-1",
          apis: ["http://14.96.26.26:8080/api/p1_pcc4_chiller1/"],
        },
        {
          id: "p1_pcc4_coolingtower",
          label: "COOLING TOWER",
          apis: ["http://14.96.26.26:8080/api/p1_pcc4_coolingtower/"],
        },
        {
          id: "p1_pcc4_cellltp4",
          label: "CELL LT PANEL-4",
          apis: ["http://14.96.26.26:8080/api/p1_pcc4_cellltp4/"],
        },
      ],
    },

    {
      id: "og_cell_lt_panel-4_overview",
      label: "OG Cell LT Panel-4 Overview",
      apis: ["http://14.96.26.26:8080/api/p1_pcc4_cellltp4/"],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_cellltp4_ahu1/",
        "http://14.96.26.26:8080/api/p1_cellltp4_ahu2/",
        "http://14.96.26.26:8080/api/p1_cellltp4_ahu3/",
        "http://14.96.26.26:8080/api/p1_cellltp4_ahu4/",
        "http://14.96.26.26:8080/api/p1_cellltp4_ahu5/",
        "http://14.96.26.26:8080/api/p1_cellltp4_spare/",
        "http://14.96.26.26:8080/api/p1_cellltp4_ahu6/",
        "http://14.96.26.26:8080/api/p1_cellltp4_ahu7/",
        "http://14.96.26.26:8080/api/p1_cellltp4_ahu8/",
        "http://14.96.26.26:8080/api/p1_cellltp4_ahu9/",
        "http://14.96.26.26:8080/api/p1_cellltp4_ahu10/",
      ],

      children: [
        {
          id: "P1_og_cell_lt_panel-4",
          label: "OG Cell LT Panel-4",
          apis: ["http://14.96.26.26:8080/api/p1_pcc4_cellltp4/"],
        },

        {
          id: "p1_cellltp4_ahu1",
          label: "AHU-1",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu1/"],
        },
        {
          id: "p1_cellltp4_ahu2",
          label: "AHU-2",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu2/"],
        },
        {
          id: "p1_cellltp4_ahu3",
          label: "AHU-3",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu3/"],
        },
        {
          id: "p1_cellltp4_ahu4",
          label: "AHU-4",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu4/"],
        },
        {
          id: "p1_cellltp4_ahu5",
          label: "AHU-5",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu5/"],
        },
        {
          id: "p1_cellltp4_spare",
          label: "cellltp4 SPARE",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_spare/"],
        },
        {
          id: "p1_cellltp4_ahu6",
          label: "AHU-6",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu6/"],
        },
        {
          id: "p1_cellltp4_ahu7",
          label: "AHU-7",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu7/"],
        },
        {
          id: "p1_cellltp4_ahu8",
          label: "AHU-8",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu8/"],
        },
        {
          id: "p1_cellltp4_ahu9",
          label: "AHU-9",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu9/"],
        },
        {
          id: "p1_cellltp4_ahu10",
          label: "AHU-10",
          apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu10/"],
        },
      ],
    },
  ],

  inverter: [
    {
      id: "overview_inverter",
      label: "Overview",
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_inverter1/",
        "http://14.96.26.26:8080/api/p1_inverter2/",
        "http://14.96.26.26:8080/api/p1_inverter3/",
        "http://14.96.26.26:8080/api/p1_inverter4/",
        "http://14.96.26.26:8080/api/p1_inverter5/",
        "http://14.96.26.26:8080/api/p1_inverter6/",
        "http://14.96.26.26:8080/api/p1_inverter7/",
        "http://14.96.26.26:8080/api/p1_inverter8/",
        "http://14.96.26.26:8080/api/p1_inverter9/",
        "http://14.96.26.26:8080/api/p1_inverter10/",
        "http://14.96.26.26:8080/api/p1_inverter11/",
        "http://14.96.26.26:8080/api/p1_inverter12/",
        "http://14.96.26.26:8080/api/p1_inverter13/",
        "http://14.96.26.26:8080/api/p1_inverter14/",
        "http://14.96.26.26:8080/api/p1_inverter15/",
        "http://14.96.26.26:8080/api/p1_inverter16/",
        "http://14.96.26.26:8080/api/p1_inverter17/",
      ],
    },
    {
      id: "p1_inverter1",
      label: "Inverter-1",
      apis: ["http://14.96.26.26:8080/api/p1_inverter1/"],
    },
    {
      id: "p1_inverter2",
      label: "Inverter-2",
      apis: ["http://14.96.26.26:8080/api/p1_inverter2/"],
    },
    {
      id: "p1_inverter3",
      label: "Inverter-3",
      apis: ["http://14.96.26.26:8080/api/p1_inverter3/"],
    },
    {
      id: "p1_inverter4",
      label: "Inverter-4",
      apis: ["http://14.96.26.26:8080/api/p1_inverter4/"],
    },
    {
      id: "p1_inverter5",
      label: "Inverter-5",
      apis: ["http://14.96.26.26:8080/api/p1_inverter5/"],
    },
    {
      id: "p1_inverter6",
      label: "Inverter-6",
      apis: ["http://14.96.26.26:8080/api/p1_inverter6/"],
    },
    {
      id: "p1_inverter7",
      label: "Inverter-7",
      apis: ["http://14.96.26.26:8080/api/p1_inverter7/"],
    },
    {
      id: "p1_inverter8",
      label: "Inverter-8",
      apis: ["http://14.96.26.26:8080/api/p1_inverter8/"],
    },
    {
      id: "p1_inverter9",
      label: "Inverter-9",
      apis: ["http://14.96.26.26:8080/api/p1_inverter9/"],
    },
    {
      id: "p1_inverter10",
      label: "Inverter-10",
      apis: ["http://14.96.26.26:8080/api/p1_inverter10/"],
    },
    {
      id: "p1_inverter11",
      label: "Inverter-11",
      apis: ["http://14.96.26.26:8080/api/p1_inverter11/"],
    },
    {
      id: "p1_inverter12",
      label: "Inverter-12",
      apis: ["http://14.96.26.26:8080/api/p1_inverter12/"],
    },
    {
      id: "p1_inverter13",
      label: "Inverter-13",
      apis: ["http://14.96.26.26:8080/api/p1_inverter13/"],
    },
    {
      id: "p1_inverter14",
      label: "Inverter-14",
      apis: ["http://14.96.26.26:8080/api/p1_inverter14/"],
    },
    {
      id: "p1_inverter15",
      label: "Inverter-15",
      apis: ["http://14.96.26.26:8080/api/p1_inverter15/"],
    },
    {
      id: "p1_inverter16",
      label: "Inverter-16",
      apis: ["http://14.96.26.26:8080/api/p1_inverter16/"],
    },
    {
      id: "p1_inverter17",
      label: "Inverter-17",
      apis: ["http://14.96.26.26:8080/api/p1_inverter17/"],
    },
  ],

  HT: [
    {
      id: "overview",
      label: "Overview",
      apis: [
        "http://14.96.26.26:8080/api/p1_pepplht_outgoing1/",
        "http://14.96.26.26:8080/api/p1_pepplht_outgoing2/",
        "http://14.96.26.26:8080/api/p1_pepplht_outgoing3/",
        "http://14.96.26.26:8080/api/p1_pepplht_outgoing4/",
      ],
      feeder_apis: [
        "http://14.96.26.26:8080/api/p1_amfs_transformer1/",
        "http://14.96.26.26:8080/api/p1_amfs_transformer2/",
        "http://14.96.26.26:8080/api/p1_amfs_transformer3/",
        "http://14.96.26.26:8080/api/p1_amfs_transformer4/",
      ],
    },
    {
      id: "p1_pepplht_outgoing1",
      label: "HT-1",

      apis: ["http://14.96.26.26:8080/api/p1_pepplht_outgoing1/"],
    },
    {
      id: "p1_pepplht_outgoing2",
      label: "HT-2",
      apis: ["http://14.96.26.26:8080/api/p1_pepplht_outgoing2/"],
    },
    {
      id: "p1_pepplht_outgoing3",
      label: "HT-3",
      apis: ["http://14.96.26.26:8080/api/p1_pepplht_outgoing3/"],
    },
    {
      id: "p1_pepplht_outgoing4",
      label: "HT-4",
      apis: ["http://14.96.26.26:8080/api/p1_pepplht_outgoing4/"],
    },
  ],
};

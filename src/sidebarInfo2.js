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
          id: "cell_pcc_panel_1_incomer",
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
              id: "og_cell_lt_panel-1",
              label: "OG Cell LT Panel-1",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ltp1/"],
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
              id: "og_cell_tool_pdb-1",
              label: "OG Cell Tool PDB-1",
              apis: ["http://14.96.26.26:8080/api/p1_pcc1_ltp2/"],
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
  amf1b: [
    {
      id: "overview",
      label: "Overview",
      apis: [
        "http://14.96.26.26:8080/api/p1_amfs_generator2/",
        "http://14.96.26.26:8080/api/p1_amfs_outgoing2/",
        "http://14.96.26.26:8080/api/p1_amfs_apfc2/",
      ],
    },
    {
      id: "dg-2",
      label: "DG-2",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_generator2/"],
    },
    {
      id: "tf-2",
      label: "Transformer-2",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_transformer2/"],
    },
    {
      id: "apfc-2",
      label: "APFC-2",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_apfc2/"],
    },
    {
      id: "og-2",
      label: "OG-2",
      apis: ["http://14.96.26.26:8080/api/p1_amfs_outgoing2/"],
    },
    {
      id: "cell_pcc_panel_2_incomer",
      label: "Cell PCC Panel-2 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_pcc2_cellincomer/"],
      children: [
        {
          id: "ups_amf1b",
          label: "UPS",
          children: [
            {
              id: "ups_2a",
              label: "UPS-2A",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_incomer2a/"],
            },
            {
              id: "ups_2b",
              label: "UPS-2B",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_incomer2b/"],
            },
            {
              id: "ups_2c",
              label: "UPS-2C",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_incomer2c/"],
            },
            {
              id: "ups_2d",
              label: "UPS-2D",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_incomer2d/"],
            },
            {
              id: "ups_2e",
              label: "UPS-2E",
              apis: ["http://14.96.26.26:8080/api/p1_ups2_incomer2e/"],
            },
          ],
        },
        {
          id: "og_cell_lt_panel-2",
          label: "OG Cell LT Panel-2",
          children: [
            {
              id: "cell_lt-2_incomer",
              label: "Cell LT-2 Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_pcc2_ogcellltp2/"],
            },
          ],
        },
        {
          id: "og_cell_tool_pdb-2",
          label: "OG Cell Tool PDB-2",
          children: [
            {
              id: "cell_tool_pdb-2_incomer",
              label: "Cell Tool PDB-2 Incomer",
              apis: ["http://14.96.26.26:8080/api/p1_pcc2_ogcelltoolpdb2/"],
            },
          ],
        },
        {
          id: "chiller_2",
          label: "Chiller-2",
          apis: ["http://14.96.26.26:8080/api/p1_pcc1_chiller2/"],
        },
      ],
    },
  ],
  pcc3: [
    {
      id: "overview_pcc3",
      label: "Overview",
      apis: [],
    },
    {
      id: "cell_pcc_panel_3_incomer",
      label: "Cell PCC Panel-3 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_pcc3_cellincomer/"],
      children: [
        {
          id: "solarincomer",
          label: "Solar Incomer",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_solarincomer/"],
        },
        {
          id: "chiller_3",
          label: "Chiller-3",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_chiller3/"],
        },
        {
          id: "chiller_4",
          label: "Chiller-4",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_chiller4/"],
        },
        {
          id: "cell_lt_panel_3",
          label: "Cell LT Panel-3",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_cellltp3/"],
        },
        {
          id: "meetfp",
          label: "MeetFP",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_meetfp/"],
        },
        {
          id: "concentratoretp",
          label: "ConcentratorETP",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_concentratoretp/"],
        },
        {
          id: "distream",
          label: "Distream",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_distream/"],
        },
        {
          id: "rinsestream",
          label: "Rinsestream",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_rinsestream/"],
        },
        {
          id: "concentratorstream",
          label: "ConcentratorStream",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_concentratorstream/"],
        },
        {
          id: "mvr",
          label: "MVR",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_mvr/"],
        },
        {
          id: "firehydrant",
          label: "FireHydrant",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_firehydrant/"],
        },
        {
          id: "dgexhaust",
          label: "DGExhaust",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_dgexhaust/"],
        },
        {
          id: "exhaustutility",
          label: "ExhaustUtility",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_exhaustutility/"],
        },
        {
          id: "scrubberexhaust",
          label: "ScrubberExhaust",
          apis: ["http://14.96.26.26:8080/api/p1_pcc3_scrubberexhaust/"],
        },
      ],
    },
  ],
  pcc4: [
    {
      id: "overview_pcc4",
      label: "Overview",
      apis: [],
    },
    {
      id: "chiller_1",
      label: "Chiller-1",
      apis: ["http://14.96.26.26:8080/api/p1_pcc4_chiller1/"],
    },
    {
      id: "cooling_tower",
      label: "Cooling Tower",
      apis: ["http://14.96.26.26:8080/api/p1_pcc4_coolingtower/"],
    },
    {
      id: "cell_ltp4",
      label: "Cell LTP4",
      apis: ["http://14.96.26.26:8080/api/p1_pcc4_cellltp4/"],
    },
  ],
  celltoolpdb1: [
    {
      id: "incomer",
      label: "Cell Tool PDB1 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_incomer/"],
    },
    {
      id: "diffusion1",
      label: "Cell Tool PDB1 Diffusion1",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion1/"],
    },
    {
      id: "diffusion2",
      label: "Cell Tool PDB1 Diffusion2",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion2/"],
    },
    {
      id: "diffusion3",
      label: "Cell Tool PDB1 Diffusion3",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion3/"],
    },
  ],
  celltoolltp1: [
    {
      id: "incomer",
      label: "Cell Tool LTP1 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_incomer/"],
    },
    {
      id: "alox1",
      label: "Cell Tool LTP1 Alox1",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox1/"],
    },
    {
      id: "alox2",
      label: "Cell Tool LTP1 Alox2",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox2/"],
    },
    {
      id: "alox3",
      label: "Cell Tool LTP1 Alox3",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox3/"],
    },
  ],
  celltoolpdb2: [
    {
      id: "incomer",
      label: "Cell Tool PDB2 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb2_incomer/"],
    },
    {
      id: "spare",
      label: "Cell Tool PDB2 Spare",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb2_spare/"],
    },
    {
      id: "sinxp3",
      label: "Cell Tool PDB2 Sinxp3",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb2_sinxp3/"],
    },
  ],
  electricalpanel: [
    {
      id: "incomer",
      label: "Electrical Panel Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_electricalpanel_incomer/"],
    },
  ],
  pepplcellltp3: [
    {
      id: "incomer",
      label: "Peppl Cell LTP3 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_pepplcellltp3/"],
    },
    {
      id: "repeat",
      label: "Peppl Cell LTP3 Repeat",
      apis: ["http://14.96.26.26:8080/api/p1_pepplcellltp3repeat/"],
    },
  ],
  pepplahu: [
    {
      id: "ahu2",
      label: "Peppl AHU2",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu2/"],
    },
    {
      id: "ahu3",
      label: "Peppl AHU3",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu3/"],
    },
    {
      id: "ahu4",
      label: "Peppl AHU4",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu4/"],
    },
    {
      id: "ahu5",
      label: "Peppl AHU5",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu5/"],
    },
    {
      id: "ahu6",
      label: "Peppl AHU6",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu6/"],
    },
    {
      id: "ahu7",
      label: "Peppl AHU7",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu7/"],
    },
    {
      id: "ahu9",
      label: "Peppl AHU9",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu9/"],
    },
    {
      id: "ahu10",
      label: "Peppl AHU10",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu10/"],
    },
  ],
  peipelahu: [
    {
      id: "ahu5",
      label: "Peipel AHU5",
      apis: ["http://14.96.26.26:8080/api/p1_peipelahu5/"],
    },
    {
      id: "ahu6",
      label: "Peipel AHU6",
      apis: ["http://14.96.26.26:8080/api/p1_peipelahu6/"],
    },
  ],
  peiplahu: [
    {
      id: "ahu7",
      label: "Peipl AHU7",
      apis: ["http://14.96.26.26:8080/api/p1_peiplahu7/"],
    },
    {
      id: "ahu8",
      label: "Peipl AHU8",
      apis: ["http://14.96.26.26:8080/api/p1_peiplahu8/"],
    },
  ],
  cellltp1: [
    {
      id: "hotwatertank1",
      label: "Hot Water Tank1",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp1_hotwatertank1/"],
    },
    {
      id: "hotwatertank2",
      label: "Hot Water Tank2",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp1_hotwatertank2/"],
    },
  ],
  cellltp2: [
    {
      id: "incomertf2",
      label: "Incomer TF2",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp2_incomertf2/"],
    },
    {
      id: "sinxp1",
      label: "SinxP1",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp2_sinxp1/"],
    },
    {
      id: "sinxp2",
      label: "SinxP2",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp2_sinxp2/"],
    },
    {
      id: "sinxp4",
      label: "SinxP4",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp2_sinxp4/"],
    },
  ],
  cellltp3: [
    {
      id: "incomer",
      label: "Cell LTP3 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp3_incomer/"],
    },
    {
      id: "aircompressor1",
      label: "Air Compressor1",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp3_aircompressor1/"],
    },
    {
      id: "aircompressor2",
      label: "Air Compressor2",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp3_aircompressor2/"],
    },
    {
      id: "aircompressor3",
      label: "Air Compressor3",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp3_aircompressor3/"],
    },
    {
      id: "aircompressor4",
      label: "Air Compressor4",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp3_aircompressor4/"],
    },
  ],
  cellltp4: [
    {
      id: "incomer",
      label: "Cell LTP4 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_incomer/"],
    },
    {
      id: "ahu1",
      label: "AHU1",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu1/"],
    },
    {
      id: "ahu2",
      label: "AHU2",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu2/"],
    },
    {
      id: "ahu3",
      label: "AHU3",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu3/"],
    },
    {
      id: "ahu4",
      label: "AHU4",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu4/"],
    },
    {
      id: "ahu5",
      label: "AHU5",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu5/"],
    },
    {
      id: "spare",
      label: "Spare",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_spare/"],
    },
    {
      id: "ahu6",
      label: "AHU6",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu6/"],
    },
    {
      id: "ahu7",
      label: "AHU7",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu7/"],
    },
    {
      id: "ahu8",
      label: "AHU8",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu8/"],
    },
    {
      id: "ahu9",
      label: "AHU9",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu9/"],
    },
    {
      id: "ahu10",
      label: "AHU10",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_ahu10/"],
    },
    {
      id: "axialflowfan",
      label: "Axial Flow Fan",
      apis: ["http://14.96.26.26:8080/api/p1_cellltp4_axialflowfan/"],
    },
  ],
  celltoolpdb1_children: [
    {
      id: "incomer",
      label: "Cell Tool PDB1 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_incomer/"],
    },
    {
      id: "diffusion1",
      label: "Diffusion1",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion1/"],
    },
    {
      id: "diffusion2",
      label: "Diffusion2",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion2/"],
    },
    {
      id: "diffusion3",
      label: "Diffusion3",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb1_diffusion3/"],
    },
  ],
  celltoolltp1_children: [
    {
      id: "incomer",
      label: "Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_incomer/"],
    },
    {
      id: "alox1",
      label: "Alox1",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox1/"],
    },
    {
      id: "alox2",
      label: "Alox2",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox2/"],
    },
    {
      id: "alox3",
      label: "Alox3",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolltp1_alox3/"],
    },
  ],
  celltoolpdb2_children: [
    {
      id: "incomer",
      label: "Cell Tool PDB2 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb2_incomer/"],
    },
    {
      id: "spare",
      label: "Spare",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb2_spare/"],
    },
    {
      id: "sinxp3",
      label: "SinxP3",
      apis: ["http://14.96.26.26:8080/api/p1_celltoolpdb2_sinxp3/"],
    },
  ],
  electricalpanel_children: [
    {
      id: "incomer",
      label: "Electrical Panel Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_electricalpanel_incomer/"],
    },
  ],
  pepplcellltp3: [
    {
      id: "incomer",
      label: "Peppl Cell LTP3 Incomer",
      apis: ["http://14.96.26.26:8080/api/p1_pepplcellltp3/"],
    },
    {
      id: "repeat",
      label: "Peppl Cell LTP3 Repeat",
      apis: ["http://14.96.26.26:8080/api/p1_pepplcellltp3repeat/"],
    },
  ],
  pepplahu_children: [
    {
      id: "ahu2",
      label: "AHU2",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu2/"],
    },
    {
      id: "ahu3",
      label: "AHU3",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu3/"],
    },
    {
      id: "ahu4",
      label: "AHU4",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu4/"],
    },
    {
      id: "ahu5",
      label: "AHU5",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu5/"],
    },
    {
      id: "ahu6",
      label: "AHU6",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu6/"],
    },
    {
      id: "ahu7",
      label: "AHU7",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu7/"],
    },
    {
      id: "ahu9",
      label: "AHU9",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu9/"],
    },
    {
      id: "ahu10",
      label: "AHU10",
      apis: ["http://14.96.26.26:8080/api/p1_pepplahu10/"],
    },
  ],
  peipelahu_children: [
    {
      id: "ahu5",
      label: "AHU5",
      apis: ["http://14.96.26.26:8080/api/p1_peipelahu5/"],
    },
    {
      id: "ahu6",
      label: "AHU6",
      apis: ["http://14.96.26.26:8080/api/p1_peipelahu6/"],
    },
  ],
  peiplahu_children: [
    {
      id: "ahu7",
      label: "AHU7",
      apis: ["http://14.96.26.26:8080/api/p1_peiplahu7/"],
    },
    {
      id: "ahu8",
      label: "AHU8",
      apis: ["http://14.96.26.26:8080/api/p1_peiplahu8/"],
    },
  ],
  inverter: [
    // Inverters from inverter1 to inverter17
    {
      id: "overview",
      label: "Overview",
      apis: [],
      feeder_apis: []
    },
    ...Array.from({ length: 17 }, (_, i) => ({
      id: `inverter${i + 1}`,
      label: `Inverter-${i + 1}`,
      apis: [`http://14.96.26.26:8080/api/p1_inverter${i + 1}/`],
    })),
  ],
};

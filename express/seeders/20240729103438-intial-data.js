module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert data into the Roles table
    await queryInterface.bulkInsert("roles", [
      {
        role_id: 1,
        role: "Admin",
        group: "Admin",
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 2,
        role: "Client",
        group: "Client",
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role_id: 3,
        role: "Subscriber",
        group: "Subscriber",
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Insert data into the DeviceTypes table
    const deviceTypes = await queryInterface.bulkInsert(
      "device_types",
      [
        {
          device_type_id: 1,
          device_type: "Smartwatch",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    // Insert data into the CheckGroups table
    const checkGroups = await queryInterface.bulkInsert(
      "check_groups",
      [
        {
          check_group_id: 1,
          check_group: "Location",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          check_group_id: 2,
          check_group: "Health",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    // Insert data into the Units table
    const units = await queryInterface.bulkInsert(
      "units",
      [
        {
          unit_id: 1,
          unit: "bpm",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          unit_id: 2,
          unit: "mmHg",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          unit_id: 3,
          unit: "%",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          unit_id: 4,
          unit: "mg/dL",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          unit_id: 5,
          unit: "C",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          unit_id: 6,
          unit: "hr",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          unit_id: 7,
          unit: "times",
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );

    // Insert data into the CheckParameters table
    await queryInterface.bulkInsert("check_parameters", [
      {
        check_parameter_id: 1,
        parameter_code: "HR",
        parameter_name: "Heart Rate",
        device_type_id: 1,
        check_group_id: 1,
        unit_id: 1,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        check_parameter_id: 2,
        parameter_code: "BP",
        parameter_name: "Blood Pressure",
        device_type_id: 1,
        check_group_id: 1,
        unit_id: 2,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        check_parameter_id: 3,
        parameter_code: "SPO2",
        parameter_name: "SPO2",
        device_type_id: 1,
        check_group_id: 1,
        unit_id: 3,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        check_parameter_id: 4,
        parameter_code: "BS",
        parameter_name: "Blood Sugar",
        device_type_id: 1,
        check_group_id: 1,
        unit_id: 4,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        check_parameter_id: 5,
        parameter_code: "BT",
        parameter_name: "Body Temperature",
        device_type_id: 1,
        check_group_id: 1,
        unit_id: 5,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        check_parameter_id: 6,
        parameter_code: "SL",
        parameter_name: "Sleep",
        device_type_id: 1,
        check_group_id: 1,
        unit_id: 6,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        check_parameter_id: 7,
        parameter_code: "PA",
        parameter_name: "Panic Alert",
        device_type_id: 1,
        check_group_id: 1,
        unit_id: 7,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        check_parameter_id: 8,
        parameter_code: "FD",
        parameter_name: "Fall Detection",
        device_type_id: 1,
        check_group_id: 1,
        unit_id: 1,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        check_parameter_id: 9,
        parameter_code: "LL",
        parameter_name: "Live Location",
        device_type_id: 1,
        check_group_id: 1,
        unit_id: 2,
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("roles", null, {});
    await queryInterface.bulkDelete("device_types", null, {});
    await queryInterface.bulkDelete("check_groups", null, {});
    await queryInterface.bulkDelete("units", null, {});
    await queryInterface.bulkDelete("check_parameters", null, {});
  },
};

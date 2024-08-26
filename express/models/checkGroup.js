module.exports = (sequelize, DataTypes) => {
    const CheckGroup = sequelize.define(
        "CheckGroup",
        {
            check_group_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            check_group: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: "check_groups", // Explicitly set table name
            timestamps: true,
            paranoid: true,
            underscored: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
        }
    );
    return CheckGroup;
};
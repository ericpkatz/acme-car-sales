const Sequelize = require('Sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db');

const { BOOLEAN, UUID, UUIDV4, STRING } = Sequelize.DataTypes;

const User = conn.define('user', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

const Car = conn.define('car', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

const Sale = conn.define('sale', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  withWarranty: {
    type: BOOLEAN,
    defaultValue: false
  },
  carId: {
    type: UUID,
    allowNull: false
  },
  userId: {
    type: UUID,
    allowNull: false
  }
});

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const [[ moe, lucy, larry], [ saab, cadillac, toyota]] = await Promise.all([
    Promise.all(['moe', 'lucy', 'larry'].map( name => User.create({ name }))),
    Promise.all(['saab', 'cadillac', 'toyota'].map( name => Car.create({ name })))
  ]);

  await Promise.all([
    Sale.create({ carId: saab.id, userId: moe.id }),
    Sale.create({ carId: saab.id, userId: moe.id }),
    Sale.create({ carId: saab.id, userId: moe.id, withWarranty: true }),
    Sale.create({ carId: cadillac.id, userId: lucy.id }),
  ]);

};

Sale.belongsTo(User);
Sale.belongsTo(Car);

module.exports = {
  syncAndSeed,
  models: {
    Sale,
    User,
    Car
  }
};

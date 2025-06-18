const dbPool = require('../config/db');

/**
 * @desc    Store a new battery data point
 * @route   POST /api/battery/data
 * @access  Public
 */
exports.storeData = async (req, res) => {
  const { battery_id, current, voltage, temperature, time } = req.body;

  if (battery_id === undefined || current === undefined || voltage === undefined || temperature === undefined || time === undefined) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // ================== FIX STARTS HERE ==================

    // 1. Convert the incoming ISO string to a JavaScript Date object.
    const dateObject = new Date(time);

    // 2. Format the date into a 'YYYY-MM-DD HH:MM:SS' string that MySQL understands.
    const mysqlTimestamp = dateObject.toISOString().slice(0, 19).replace('T', ' ');

    // =================== FIX ENDS HERE ===================


    const insertQuery = 'INSERT INTO battery_data (battery_id, current, voltage, temperature, `time`) VALUES (?, ?, ?, ?, ?);';
    
    // Use the NEW formatted timestamp in the values array
    const values = [battery_id, current, voltage, temperature, mysqlTimestamp];
    
    const [result] = await dbPool.execute(insertQuery, values);

    const selectQuery = 'SELECT * FROM battery_data WHERE id = ?';
    const [rows] = await dbPool.execute(selectQuery, [result.insertId]);
    
    console.log(`Data stored for battery ${battery_id} with new ID ${result.insertId}`);
    res.status(201).json(rows[0]);

  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// ... (rest of the functions: getBatteryData, getBatteryFieldData) ...
// (Make sure the rest of the file is also present)
/**
 * @desc    Retrieve all data for a specific battery
 * @route   GET /api/battery/:id
 * @access  Private (Requires JWT)
 */
exports.getBatteryData = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM battery_data WHERE battery_id = ? ORDER BY `time` DESC';
    const [rows] = await dbPool.execute(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: `No data found for battery ID ${id}` });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving all data for battery:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * @desc    Retrieve a specific field for a battery, with an optional time range
 * @route   GET /api/battery/:id/:field
 * @access  Private (Requires JWT)
 */
exports.getBatteryFieldData = async (req, res) => {
  const { id, field } = req.params;
  const { start, end } = req.query;

  const allowedFields = ['current', 'voltage', 'temperature'];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: 'Invalid field specified. Allowed fields are: current, voltage, temperature.' });
  }

  try {
    let query = `SELECT \`time\`, \`${field}\` FROM battery_data WHERE battery_id = ?`;
    const queryParams = [id];
    
    if (start && end) {
      query += ' AND `time` BETWEEN ? AND ? ORDER BY `time` DESC';
      queryParams.push(start, end);
    } else {
      query += ' ORDER BY `time` DESC';
    }

    const [rows] = await dbPool.execute(query, queryParams);

    if (rows.length === 0) {
      return res.status(404).json({ error: `No data found for battery ID ${id} in the specified criteria.` });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error(`Error retrieving field data ('${field}') for battery:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const sqlite3 = require('sqlite3').verbose();

async function migrateData() {
    const db = new sqlite3.Database('../data/audit.db');

    // Attach target code base
    db.exec(`ATTACH DATABASE '../data/audits.db' AS targetDB;`, (err) => {
        if (err) {
            console.error("Error attaching database: ", err);
            return;
        }

        console.log("Database attached successfully!");

        // Copy audits data from audit.db to audits.db
        db.exec(`
            INSERT INTO targetDB.audits (id, category, date_performed)
            SELECT id, category, date_performed FROM audits;
            `, (err) => {
            if (err) {
                console.error("Error transferring audits data for 'audits': ", err);
            } else {
                console.log("Audits data transferred successfully for 'audits' table!");
            }
        });
    });

    // Copy inventory data from audit.db to audits.db
    db.exec(`
        INSERT INTO targetDB.inventory (audit_id, name, upc, inventory_amount, actual_amount)
        SELECT audit_id, name, upc, inventory_amount, actual_amount FROM inventory;
        `, (err) => {
        if (err) {
            console.error("Error transferring inventory data for 'audits': ", err);
        } else {
            console.log("Inventory data transferred successfully for 'audits' table!");
        }
    })

    // Close the database connection
    db.close((err) => {
        if (err) {
            console.error("Error closing the database: ", err);
        } else {
            console.log("Database connection closed.");
        }
    });
}

migrateData();
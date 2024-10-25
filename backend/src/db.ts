import sqlite3 from "sqlite3";
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.resolve(__dirname, '../data/audit.db');

const dbPromise = open({
    filename: dbPath,
    driver: sqlite3.Database
});

export async function createAuditTable() {
    const db = await dbPromise;
    await db.exec(`
        CREATE TABLE IF NOT EXISTS audits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT,
            date_performed DATETIME
        )
    `);
    await db.exec(`
        CREATE TABLE IF NOT EXISTS inventory (
            audit_id INTEGER,
            name TEXT,
            upc TEXT,
            inventory_amount INTEGER,
            actual_amount INTEGER DEFAULT 0,
            FOREIGN KEY (audit_id) REFERENCES audits(id)
        )
    `)
}

// Insert audit into audits table
export async function insertAudit(category: string, date_performed: string) {
    const db = await dbPromise;
    const result = await db.run(
        `INSERT INTO audits (category, date_performed) VALUES (?, ?)`,
        [category, date_performed]
    );
    return result.lastID;  // Return the audit ID to link inventory later
}

// Insert inventory items related to an audit
export async function insertInventory(audit_id: number, name: string, upc: string, inventory_amount: number) {
    const db = await dbPromise;
    await db.run(
        `INSERT INTO inventory (audit_id, name, upc, inventory_amount) VALUES (?, ?, ?, ?)`,
        [audit_id, name, upc, inventory_amount]
    );
}

// Update inventory items count related to an audit
export async function updateCount(audit_id: number, upc: string) {
    const db = await dbPromise;
    const result = await db.run(
        `UPDATE inventory SET actual_amount = actual_amount + 1 WHERE audit_id = ? AND upc = ?`,
        [audit_id, upc]
    );

    // Check if the row was updated (result.changes tells how many rows were affected)
    if (result.changes === 0) {
        // UPC does not exist, handle that by returning a signal to the frontend
        return { success: false, message: 'UPC not found' };
    }

    return { success: true, message: 'Count updated' };
}

// Retrieve all audits
export async function getAudits() {
    const db = await dbPromise;
    return await db.all(`SELECT * FROM audits`);
}

// Retrieve inventory for a specific audit
export async function getInventoryByAuditId(audit_id: number) {
    const db = await dbPromise;
    return await db.all(`SELECT * FROM inventory WHERE audit_id = ?`, [audit_id]);
}

export async function getAuditItems(audit_id: number) {
    const db = await dbPromise;
    try {
        const items = await db.all(
            `SELECT * FROM inventory WHERE audit_id = ?`,
            [audit_id]
        );
        return items;
    } catch (error) {
        console.error('Error fetching audit items:', error);
        throw error;
    }
}

export async function getDiscrepancies(audit_id: number) {
    const db = await dbPromise;
    try {
        const discrepancies = await db.all(
            `SELECT audit_id, name, upc, inventory_amount, actual_amount,
            (actual_amount - inventory_amount) AS difference
            FROM inventory
            WHERE audit_id = ? AND inventory_amount != actual_amount`,
            [audit_id]
        );
        return discrepancies;
    } catch (error) {
        console.error('Error fetching discrepancies:', error);
        throw error;
    }
}
import express, { Request, Response } from 'express';
import multer from 'multer';
import { createAuditTable, getAudits, insertAudit, insertInventory, updateCount, getAuditItems } from './db';
import csvParser from 'csv-parser';
import fs, { PathLike } from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/' }); // temporary storage for CSV files
const port = 5001;

app.use(express.json());

createAuditTable();

app.post('/create-audit', upload.single('file'), async (req: Request, res: Response) => {
    const { category } = req.body; // Category will be one of Supplements, Snacks, etc.
    const csvFilePath = req.file?.path;

    // Create new audit row
    const auditId = await insertAudit(category, new Date().toISOString());

    // Parse CSV and filter based on category (you’ll need to customize this part)
    const results: any[] = [];
    fs.createReadStream(csvFilePath as PathLike)
        .pipe(csvParser())
        .on('data', (data) => {
            console.log(data);
            // Filter by the category and process items here
            if (data['Profit Center'] === category) {
                results.push(data);
            }
        })
        .on('end', async () => {
            for (const row of results) {
                await insertInventory(auditId!, row['Item Name'], row['Item UPC'], parseInt(row['Quantity on Hand']));
            }
            res.json({ message: 'Audit created successfully', auditId });
        });
});

app.post('/update-upc', async (req: Request, res: Response) => {
    const { audit_id, upc } = req.body;

    try {
        const result = await updateCount(audit_id, upc);
        if (!result.success) {
            res.status(404).json({ success: false, message: 'UPC not found' });
            return;
        }
        res.json({ success: true, message: 'Count updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/audit/:audit_id/items', async (req, res) => {
    const { audit_id } = req.params;

    try {
        const items = await getAuditItems(parseInt(audit_id));

        if (!items.length) {
            return
            res.status(404).json({ message: 'No items found for this audit' });
        }

        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// app.get('/audit/:audit_id/discrepancies', async (req: Request, res: Response) => {
//     const { audit_id } = req.params;
//     const discrepancies = await getDiscrepancies(audit_id); // Compare inventory amount vs actual amount
//     res.json(discrepancies);
// });

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from Express!' });
});

app.get('/history', async (req, res) => {
    const history = await getAudits();
    res.json(history);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
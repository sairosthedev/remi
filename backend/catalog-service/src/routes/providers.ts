import express, { Request, Response } from 'express';
import Provider from '../models/Provider';

const router = express.Router();

// Get all providers
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, country, isActive } = req.query;

    const query: any = {};
    if (category) query.category = category;
    if (country) query.country = country;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const providers = await Provider.find(query).sort({ name: 1 });

    res.json({ providers });
  } catch (error: any) {
    console.error('Get providers error:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

// Get provider by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    res.json({ provider });
  } catch (error: any) {
    console.error('Get provider error:', error);
    res.status(500).json({ error: 'Failed to fetch provider' });
  }
});

// Create provider
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, country, category, logo } = req.body;

    if (!name || !email || !phone || !address || !country || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingProvider = await Provider.findOne({ email });
    if (existingProvider) {
      return res.status(400).json({ error: 'Provider with this email already exists' });
    }

    const provider = new Provider({
      name,
      email,
      phone,
      address,
      country,
      category,
      logo,
    });

    await provider.save();

    res.status(201).json({ message: 'Provider created successfully', provider });
  } catch (error: any) {
    console.error('Create provider error:', error);
    res.status(500).json({ error: 'Failed to create provider' });
  }
});

// Update provider
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    res.json({ message: 'Provider updated successfully', provider });
  } catch (error: any) {
    console.error('Update provider error:', error);
    res.status(500).json({ error: 'Failed to update provider' });
  }
});

// Delete provider
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    res.json({ message: 'Provider deleted successfully' });
  } catch (error: any) {
    console.error('Delete provider error:', error);
    res.status(500).json({ error: 'Failed to delete provider' });
  }
});

export default router;


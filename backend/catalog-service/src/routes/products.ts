import express, { Request, Response } from 'express';
import Product from '../models/Product';

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      category,
      country,
      providerId,
      search,
      page = '1',
      limit = '20',
      minPrice,
      maxPrice,
    } = req.query;

    const query: any = {};

    if (category) query.category = category;
    if (country) query.country = country;
    if (providerId) query.providerId = providerId;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search as string };
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (in production, add auth middleware)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      description,
      category,
      country,
      store,
      providerId,
      image,
      stock,
    } = req.body;

    if (!name || !price || !description || !category || !country || !store || !providerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      country,
      store,
      providerId,
      image,
      stock: stock || 0,
    });

    await product.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error: any) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get categories
router.get('/meta/categories', async (req: Request, res: Response) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get countries
router.get('/meta/countries', async (req: Request, res: Response) => {
  try {
    const countries = await Product.distinct('country');
    res.json({ countries });
  } catch (error: any) {
    console.error('Get countries error:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

export default router;


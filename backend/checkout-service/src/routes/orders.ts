import express, { Request, Response } from 'express';
import axios from 'axios';
import Order from '../models/Order';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://cart-service:3003';

// Create order (checkout)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!shippingAddress.street || !shippingAddress.city || 
        !shippingAddress.country || !shippingAddress.postalCode) {
      return res.status(400).json({ error: 'Incomplete shipping address' });
    }

    // Get cart from cart service
    let cart;
    try {
      const token = req.headers.authorization;
      const cartResponse = await axios.get(`${CART_SERVICE_URL}/api/cart`, {
        headers: { Authorization: token },
      });
      cart = cartResponse.data.cart;
    } catch (error: any) {
      console.error('Error fetching cart:', error.message);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );

    // Create order
    const order = new Order({
      userId,
      items: cart.items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await order.save();

    // In production, process payment here
    // For demo, simulate successful payment
    order.paymentStatus = 'paid';
    order.status = 'processing';
    await order.save();

    // Clear cart after successful order
    try {
      const token = req.headers.authorization;
      await axios.delete(`${CART_SERVICE_URL}/api/cart`, {
        headers: { Authorization: token },
      });
    } catch (error: any) {
      console.error('Error clearing cart:', error.message);
      // Don't fail order if cart clear fails
    }

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user orders
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { status, page = '1', limit = '10' } = req.query;

    const query: any = { userId };
    if (status) query.status = status;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 }),
      Order.countDocuments(query),
    ]);

    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const order = await Order.findOne({ _id: req.params.id, userId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error: any) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only in production)
router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error: any) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Cancel order
router.post('/:id/cancel', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const order = await Order.findOne({ _id: req.params.id, userId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error: any) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;


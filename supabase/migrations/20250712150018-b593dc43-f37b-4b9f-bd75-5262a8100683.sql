-- Fix critical RLS policy gaps identified in security review

-- 1. Add INSERT policy for order_items table
-- Users should only be able to create order items for orders they own
CREATE POLICY "Users can create order items for own orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- 2. Add DELETE policy for profiles table
-- Users should be able to delete their own profiles
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- 3. Add UPDATE/DELETE policies for order_items for business logic completeness
-- Users can update order items for their own orders (for quantity changes before order completion)
CREATE POLICY "Users can update order items for own orders" 
ON public.order_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
    AND orders.status = 'pending'
  )
);

-- Users can delete order items from their own pending orders
CREATE POLICY "Users can delete order items from own pending orders" 
ON public.order_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
    AND orders.status = 'pending'
  )
);
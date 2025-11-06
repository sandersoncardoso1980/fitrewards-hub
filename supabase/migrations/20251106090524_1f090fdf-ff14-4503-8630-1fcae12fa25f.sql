-- Fix search_path for all functions to be immutable

-- Fix update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix award_challenge_points function
CREATE OR REPLACE FUNCTION public.award_challenge_points()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  challenge_points INTEGER;
BEGIN
  -- Only award points when completing (not when joining)
  IF NEW.completed = TRUE AND (OLD.completed = FALSE OR OLD.completed IS NULL) THEN
    -- Get challenge points
    SELECT points INTO challenge_points
    FROM public.challenges
    WHERE id = NEW.challenge_id;
    
    -- Update user points
    UPDATE public.profiles
    SET points = points + challenge_points
    WHERE id = NEW.user_id;
    
    -- Set completion timestamp
    NEW.completed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;
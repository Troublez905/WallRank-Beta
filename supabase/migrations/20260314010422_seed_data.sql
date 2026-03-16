insert into public.users (
  id,
  email,
  username,
  display_name,
  city,
  country,
  role,
  supporter_points
) values
  ('11111111-1111-1111-1111-111111111111', 'admin@wallrank.local', 'wallrank_admin', 'WallRank Admin', 'Hamilton', 'Canada', 'admin', 0),
  ('22222222-2222-2222-2222-222222222222', 'maya@wallrank.local', 'mayaspray', 'Maya Spray', 'Hamilton', 'Canada', 'user', 14),
  ('33333333-3333-3333-3333-333333333333', 'joel@wallrank.local', 'joelnorth', 'Joel North', 'Toronto', 'Canada', 'user', 9);

insert into public.artists (
  id,
  owner_user_id,
  tag_name,
  display_name,
  slug,
  city,
  country,
  is_verified,
  is_claimed,
  total_points,
  monthly_points,
  all_time_avg_rating,
  artwork_count,
  spot_count
) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'AERO', 'Aero', 'aero', 'Hamilton', 'Canada', true, true, 93, 28, 4.62, 3, 3),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', null, 'NOVA', 'Nova', 'nova', 'Toronto', 'Canada', false, false, 58, 19, 4.24, 2, 2),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', null, 'BRICK', 'Brick', 'brick', 'Niagara', 'Canada', false, false, 41, 12, 4.11, 1, 1);

insert into public.locations (
  id,
  name,
  address_text,
  city,
  province_state,
  country,
  latitude,
  longitude,
  geohash,
  location_visibility,
  is_sensitive
) values
  ('44444444-4444-4444-4444-444444444444', 'King William Wall', 'King William St', 'Hamilton', 'ON', 'Canada', 43.255203, -79.868202, 'dpz89n', 'public_approximate', false),
  ('55555555-5555-5555-5555-555555555555', 'Laneway Junction', 'Dupont St', 'Toronto', 'ON', 'Canada', 43.669021, -79.442851, 'dpz83h', 'public_exact', false),
  ('66666666-6666-6666-6666-666666666666', 'Canal Wall', 'Welland Canal Pkwy', 'Niagara', 'ON', 'Canada', 43.012321, -79.248321, 'dpv1cw', 'public_approximate', false);

insert into public.artworks (
  id,
  artist_id,
  location_id,
  submitted_by_user_id,
  title,
  slug,
  description,
  category,
  style_tags,
  status,
  wall_type,
  date_seen,
  avg_rating,
  ratings_count,
  comments_count,
  artist_points_total,
  is_featured,
  featured_month
) values
  ('77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'King William Burner', 'king-william-burner', 'Large multicolor burner with chrome fill and sharp highlights.', 'piece', '{"wildstyle","colorfade"}', 'active', 'warehouse', '2026-03-01', 4.60, 18, 4, 83, true, '2026-03-01'),
  ('88888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Junction Mural', 'junction-mural', 'Character mural with layered background textures.', 'mural', '{"character","portrait"}', 'active', 'brick', '2026-02-25', 4.20, 10, 2, 42, false, null),
  ('99999999-9999-9999-9999-999999999999', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Canal Throwup', 'canal-throwup', 'Quick silver-and-black throwup on a concrete retaining wall.', 'throwup', '{"silver","outline"}', 'active', 'concrete', '2026-02-19', 4.00, 7, 1, 28, false, null);

insert into public.artwork_images (
  id,
  artwork_id,
  uploaded_by_user_id,
  image_url,
  thumbnail_url,
  caption,
  sort_order,
  is_primary,
  timeline_type,
  moderation_status
) values
  ('12121212-1212-1212-1212-121212121212', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'https://example.com/king-william-burner.jpg', 'https://example.com/king-william-burner-thumb.jpg', 'Front view at golden hour.', 0, true, 'standard', 'approved'),
  ('13131313-1313-1313-1313-131313131313', '88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'https://example.com/junction-mural.jpg', 'https://example.com/junction-mural-thumb.jpg', 'Full wall view.', 0, true, 'standard', 'approved');

insert into public.ratings (
  id,
  artwork_id,
  artist_id,
  user_id,
  stars,
  artist_points_awarded,
  supporter_points_awarded,
  is_verified_vote
) values
  ('14141414-1414-1414-1414-141414141414', '77777777-7777-7777-7777-777777777777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 5, 5, 1, true),
  ('15151515-1515-1515-1515-151515151515', '88888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 4, 4, 1, false);

insert into public.comments (
  id,
  artwork_id,
  user_id,
  parent_comment_id,
  body,
  helpful_count,
  moderation_status
) values
  ('16161616-1616-1616-1616-161616161616', '77777777-7777-7777-7777-777777777777', '33333333-3333-3333-3333-333333333333', null, 'Fresh color work on this one.', 2, 'visible'),
  ('17171717-1717-1717-1717-171717171717', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', '16161616-1616-1616-1616-161616161616', 'Caught it right after the update.', 1, 'visible');

insert into public.artist_point_events (
  id,
  artist_id,
  artwork_id,
  source_type,
  source_id,
  points
) values
  ('18181818-1818-1818-1818-181818181818', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777', 'rating', '14141414-1414-1414-1414-141414141414', 5),
  ('19191919-1919-1919-1919-191919191919', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '88888888-8888-8888-8888-888888888888', 'rating', '15151515-1515-1515-1515-151515151515', 4);

insert into public.supporter_point_events (
  id,
  user_id,
  source_type,
  source_id,
  points
) values
  ('20202020-2020-2020-2020-202020202020', '33333333-3333-3333-3333-333333333333', 'rating', '14141414-1414-1414-1414-141414141414', 1),
  ('21212121-2121-2121-2121-212121212121', '33333333-3333-3333-3333-333333333333', 'comment', '16161616-1616-1616-1616-161616161616', 1);

insert into public.monthly_leaderboards (
  id,
  leaderboard_month,
  leaderboard_type,
  entity_id,
  rank_position,
  points_total,
  metadata
) values
  ('23232323-2323-2323-2323-232323232323', '2026-03-01', 'artist', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 28, '{"city":"Hamilton"}'),
  ('24242424-2424-2424-2424-242424242424', '2026-03-01', 'artist', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 19, '{"city":"Toronto"}'),
  ('25252525-2525-2525-2525-252525252525', '2026-03-01', 'artist', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 3, 12, '{"city":"Niagara"}');

insert into public.featured_artists (
  id,
  artist_id,
  feature_type,
  feature_month,
  headline,
  article_excerpt,
  is_published
) values
  ('26262626-2626-2626-2626-262626262626', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'homepage_top5', '2026-03-01', 'Hamilton color control', 'Aero leads the month with strong community ratings and a standout warehouse burner.', true);

-- Expanded seed data for Hamilton, Toronto, and Niagara

-- Additional users
insert into public.users (
  id,
  email,
  username,
  display_name,
  city,
  country,
  role,
  supporter_points
) values
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'alex@wallrank.local', 'alexstreet', 'Alex Street', 'Hamilton', 'Canada', 'user', 22),
  ('bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'sam@wallrank.local', 'samurban', 'Sam Urban', 'Toronto', 'Canada', 'user', 15),
  ('c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'lisa@wallrank.local', 'lisacanvas', 'Lisa Canvas', 'Niagara', 'Canada', 'user', 18),
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'mike@wallrank.local', 'mikebomb', 'Mike Bomb', 'Hamilton', 'Canada', 'user', 10),
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'taylor@wallrank.local', 'taylorthrow', 'Taylor Throw', 'Toronto', 'Canada', 'user', 12),
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'jordan@wallrank.local', 'jordangraffiti', 'Jordan Graffiti', 'Niagara', 'Canada', 'user', 8);

-- Additional artists
insert into public.artists (
  id,
  owner_user_id,
  tag_name,
  display_name,
  slug,
  city,
  country,
  is_verified,
  is_claimed,
  total_points,
  monthly_points,
  all_time_avg_rating,
  artwork_count,
  spot_count
) values
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'STORM', 'Storm', 'storm', 'Hamilton', 'Canada', true, true, 75, 25, 4.5, 4, 3),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', null, 'ECHO', 'Echo', 'echo', 'Toronto', 'Canada', false, false, 62, 20, 4.3, 3, 2),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', null, 'BLAST', 'Blast', 'blast', 'Niagara', 'Canada', false, false, 48, 15, 4.0, 2, 2),
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'SHADOW', 'Shadow', 'shadow', 'Hamilton', 'Canada', true, true, 55, 18, 4.2, 2, 2),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', null, 'FLAME', 'Flame', 'flame', 'Toronto', 'Canada', false, false, 40, 10, 3.9, 1, 1);

-- Additional locations
insert into public.locations (
  id,
  name,
  address_text,
  city,
  province_state,
  country,
  latitude,
  longitude,
  geohash,
  location_visibility,
  is_sensitive
) values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'James Street Underpass', 'James St S', 'Hamilton', 'ON', 'Canada', 43.2485, -79.8662, 'dpz89m', 'public_exact', false),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Graffiti Alley', 'Richmond St W', 'Toronto', 'ON', 'Canada', 43.6505, -79.3792, 'dpz8g4', 'public_exact', false),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Rainbow Bridge Wall', 'Rainbow Bridge', 'Niagara', 'ON', 'Canada', 43.0912, -79.0714, 'dpv1g2', 'public_approximate', false),
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Barton Street Bridge', 'Barton St E', 'Hamilton', 'ON', 'Canada', 43.2621, -79.8623, 'dpz89p', 'public_exact', false),
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Distillery District', 'Mill St', 'Toronto', 'ON', 'Canada', 43.6502, -79.3598, 'dpz8g8', 'public_exact', false),
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'Clifton Hill Wall', 'Clifton Hill', 'Niagara', 'ON', 'Canada', 43.0889, -79.0786, 'dpv1fz', 'public_exact', false);

-- Additional artworks
insert into public.artworks (
  id,
  artist_id,
  location_id,
  submitted_by_user_id,
  title,
  slug,
  description,
  category,
  style_tags,
  status,
  wall_type,
  date_seen,
  avg_rating,
  ratings_count,
  comments_count,
  artist_points_total,
  is_featured,
  featured_month
) values
  ('oooooooo-oooo-oooo-oooo-oooooooooooo', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'Underpass Masterpiece', 'underpass-masterpiece', 'Bold blackbook style piece with intricate lettering.', 'piece', '{"blackbook","lettering"}', 'active', 'concrete', '2026-02-28', 4.7, 12, 3, 56, false, null),
  ('pppppppp-pppp-pppp-pppp-pppppppppppp', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'Alley Sticker Bomb', 'alley-sticker-bomb', 'Collection of wheatpaste stickers covering the alley wall.', 'sticker', '{"wheatpaste","stickerbomb"}', 'active', 'brick', '2026-02-26', 4.1, 8, 1, 33, false, null),
  ('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'Bridge Mural', 'bridge-mural', 'Large scale mural depicting local history.', 'mural', '{"historical","landscape"}', 'active', 'concrete', '2026-02-24', 4.3, 15, 4, 65, true, '2026-03-01'),
  ('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Bridge Graffiti', 'bridge-graffiti', 'Quick tags and throwups on the bridge supports.', 'graffiti', '{"tag","throwup"}', 'active', 'metal', '2026-02-22', 3.8, 6, 2, 23, false, null),
  ('ssssssss-ssss-ssss-ssss-ssssssssssss', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Distillery Pasteup', 'distillery-pasteup', 'Wheatpaste artwork in the historic district.', 'pasteup', '{"wheatpaste","vintage"}', 'active', 'brick', '2026-02-20', 4.0, 9, 1, 36, false, null),
  ('tttttttt-tttt-tttt-tttt-tttttttttttt', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'Clifton Hill Piece', 'clifton-hill-piece', 'Colorful piece overlooking the falls.', 'piece', '{"colorful","scenic"}', 'active', 'concrete', '2026-02-18', 4.5, 20, 5, 90, true, '2026-03-01'),
  ('uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'King William Tag', 'king-william-tag', 'Simple tag on the famous wall.', 'graffiti', '{"tag"}', 'active', 'warehouse', '2026-02-16', 3.5, 4, 0, 14, false, null),
  ('vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'Laneway Character', 'laneway-character', 'Cartoon character in the laneway.', 'graffiti', '{"cartoon","character"}', 'active', 'brick', '2026-02-14', 4.2, 11, 2, 46, false, null);

-- Additional artwork images
insert into public.artwork_images (
  id,
  artwork_id,
  uploaded_by_user_id,
  image_url,
  thumbnail_url,
  caption,
  sort_order,
  is_primary,
  timeline_type,
  moderation_status
) values
  ('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', 'oooooooo-oooo-oooo-oooo-oooooooooooo', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'https://example.com/underpass-piece.jpg', 'https://example.com/underpass-piece-thumb.jpg', 'Detail shot of the lettering.', 0, true, 'standard', 'approved'),
  ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'pppppppp-pppp-pppp-pppp-pppppppppppp', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'https://example.com/alley-stickers.jpg', 'https://example.com/alley-stickers-thumb.jpg', 'Collection of stickers.', 0, true, 'standard', 'approved'),
  ('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', 'qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'cccccccc-dddd-eeee-ffff-gggggggggggg', 'https://example.com/bridge-mural.jpg', 'https://example.com/bridge-mural-thumb.jpg', 'Wide view of the mural.', 0, true, 'standard', 'approved'),
  ('zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz', 'rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', 'dddddddd-eeee-ffff-gggg-hhhhhhhhhhhh', 'https://example.com/bridge-tags.jpg', 'https://example.com/bridge-tags-thumb.jpg', 'Tags on the bridge.', 0, true, 'standard', 'approved'),
  ('abababab-abab-abab-abab-abababababab', 'ssssssss-ssss-ssss-ssss-ssssssssssss', 'eeeeeeee-ffff-gggg-hhhh-iiiiiiiiiiii', 'https://example.com/distillery-pasteup.jpg', 'https://example.com/distillery-pasteup-thumb.jpg', 'Historic district artwork.', 0, true, 'standard', 'approved'),
  ('bcbcbcbc-bcbc-bcbc-bcbc-bcbcbcbcbcbc', 'tttttttt-tttt-tttt-tttt-tttttttttttt', 'ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj', 'https://example.com/clifton-piece.jpg', 'https://example.com/clifton-piece-thumb.jpg', 'Piece with falls in background.', 0, true, 'standard', 'approved');

-- Additional ratings
insert into public.ratings (
  id,
  artwork_id,
  artist_id,
  user_id,
  stars,
  artist_points_awarded,
  supporter_points_awarded,
  is_verified_vote
) values
  ('cdcdcdcd-cdcd-cdcd-cdcd-cdcdcdcdcdcd', 'oooooooo-oooo-oooo-oooo-oooooooooooo', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 5, 5, 1, true),
  ('edededed-eded-eded-eded-edededededed', 'pppppppp-pppp-pppp-pppp-pppppppppppp', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 4, 4, 1, false),
  ('fefefefe-fefe-fefe-fefe-fefefefefefe', 'qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'dddddddd-eeee-ffff-gggg-hhhhhhhhhhhh', 4, 4, 1, false),
  ('ghghghgh-ghgh-ghgh-ghgh-ghghghghghgh', 'rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'eeeeeeee-ffff-gggg-hhhh-iiiiiiiiiiii', 4, 4, 1, false),
  ('hihihihi-hihi-hihi-hihi-hihihihihihi', 'ssssssss-ssss-ssss-ssss-ssssssssssss', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'ffffffff-gggg-hhhh-iiii-jjjjjjjjjjjj', 4, 4, 1, false),
  ('jkjkjkjk-jkjk-jkjk-jkjk-jkjkjkjkjkjk', 'tttttttt-tttt-tttt-tttt-tttttttttttt', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 5, 5, 1, true),
  ('lmlmlmlm-lmlm-lmlm-lmlm-lmlmlmlmlmlm', 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 3, 3, 1, false),
  ('nononono-nono-nono-nono-nononononono', 'vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'cccccccc-dddd-eeee-ffff-gggggggggggg', 4, 4, 1, false);

-- Additional comments
insert into public.comments (
  id,
  artwork_id,
  user_id,
  parent_comment_id,
  body,
  helpful_count,
  moderation_status
) values
  ('opopopop-opop-opop-opop-opopopopopop', 'oooooooo-oooo-oooo-oooo-oooooooooooo', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', null, 'Love the style!', 1, 'visible'),
  ('qrqrqrqr-qrqr-qrqr-qrqr-qrqrqrqrqrqr', 'qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'dddddddd-eeee-ffff-gggg-hhhhhhhhhhhh', null, 'Beautiful work.', 2, 'visible'),
  ('stststst-stst-stst-stst-stststststst', 'tttttttt-tttt-tttt-tttt-tttttttttttt', 'eeeeeeee-ffff-gggg-hhhh-iiiiiiiiiiii', null, 'Amazing location.', 3, 'visible');

-- Additional leaderboards
insert into public.monthly_leaderboards (
  id,
  leaderboard_month,
  leaderboard_type,
  entity_id,
  rank_position,
  points_total,
  metadata
) values
  ('uvuvuvuv-uvuv-uvuv-uvuv-uvuvuvuvuvuv', '2026-03-01', 'artist', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 4, 25, '{"city":"Hamilton"}'),
  ('wxwxwxwx-wxwx-wxwx-wxwx-wxwxwxwxwxwx', '2026-03-01', 'artist', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 5, 20, '{"city":"Toronto"}'),
  ('yzyzyzyz-yzyz-yzyz-yzyz-yzyzyzyzyzyz', '2026-03-01', 'supporter', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 1, 22, '{"city":"Hamilton"}'),
  ('zxzxzxzx-zxzx-zxzx-zxzx-zxzxzxzxzxzx', '2026-03-01', 'supporter', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 2, 15, '{"city":"Toronto"}');

-- Additional featured artists
insert into public.featured_artists (
  id,
  artist_id,
  feature_type,
  feature_month,
  headline,
  article_excerpt,
  is_published
) values
  ('qwqwqwqw-qwqw-qwqw-qwqw-qwqwqwqwqwqw', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'magazine', '2026-03-01', 'Hamilton Underground', 'Storm brings fresh energy to the scene with bold pieces.', true),
  ('erererer-erer-erer-erer-erererererer', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'instore', '2026-03-01', 'Niagara Murals', 'Blast featured in local gallery showcase.', true);

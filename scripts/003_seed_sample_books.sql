-- Insert sample books for testing
INSERT INTO public.books (title, author, isbn, description, cover_url, publication_date, pages, language, genres) VALUES
('Cien años de soledad', 'Gabriel García Márquez', '9780060883287', 'Una obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.', '/placeholder.svg?height=400&width=300', '1967-06-05', 417, 'es', ARRAY['Realismo mágico', 'Literatura latinoamericana']),
('El amor en los tiempos del cólera', 'Gabriel García Márquez', '9780307389732', 'Una historia de amor que perdura a través de los años, ambientada en el Caribe colombiano.', '/placeholder.svg?height=400&width=300', '1985-01-01', 348, 'es', ARRAY['Romance', 'Literatura latinoamericana']),
('La casa de los espíritus', 'Isabel Allende', '9780553383805', 'La saga de una familia chilena a través de cuatro generaciones, mezclando realidad y fantasía.', '/placeholder.svg?height=400&width=300', '1982-01-01', 433, 'es', ARRAY['Realismo mágico', 'Drama familiar']),
('Rayuela', 'Julio Cortázar', '9780394752846', 'Una novela experimental que puede leerse de múltiples maneras, explorando la búsqueda existencial de sus protagonistas.', '/placeholder.svg?height=400&width=300', '1963-01-01', 635, 'es', ARRAY['Literatura experimental', 'Ficción']),
('Pedro Páramo', 'Juan Rulfo', '9780802133908', 'Una obra fundamental de la literatura mexicana que narra la búsqueda de un hijo por su padre en un pueblo fantasmal.', '/placeholder.svg?height=400&width=300', '1955-01-01', 124, 'es', ARRAY['Realismo mágico', 'Literatura mexicana']),
('Ficciones', 'Jorge Luis Borges', '9780802130303', 'Una colección de cuentos que exploran laberintos, espejos, bibliotecas infinitas y otros conceptos metafísicos.', '/placeholder.svg?height=400&width=300', '1944-01-01', 174, 'es', ARRAY['Cuentos', 'Literatura fantástica']),
('La ciudad y los perros', 'Mario Vargas Llosa', '9780374529970', 'Una novela que retrata la vida en una academia militar limeña y critica la sociedad peruana.', '/placeholder.svg?height=400&width=300', '1963-01-01', 409, 'es', ARRAY['Drama', 'Literatura peruana']),
('Como agua para chocolate', 'Laura Esquivel', '9780385420174', 'Una novela que combina recetas de cocina con una historia de amor prohibido en el México revolucionario.', '/placeholder.svg?height=400&width=300', '1989-01-01', 246, 'es', ARRAY['Realismo mágico', 'Romance']),
('El túnel', 'Ernesto Sabato', '9780345806162', 'Una novela psicológica que explora la obsesión y la soledad a través de la historia de un pintor atormentado.', '/placeholder.svg?height=400&width=300', '1948-01-01', 158, 'es', ARRAY['Psicológica', 'Drama']),
('Crónica de una muerte anunciada', 'Gabriel García Márquez', '9781400034956', 'Una novela corta que reconstruye los eventos que llevaron al asesinato de Santiago Nasar.', '/placeholder.svg?height=400&width=300', '1981-01-01', 120, 'es', ARRAY['Misterio', 'Literatura latinoamericana']);

-- Update ratings count and average rating for sample books
UPDATE public.books SET 
  average_rating = 4.5,
  ratings_count = 1250
WHERE title = 'Cien años de soledad';

UPDATE public.books SET 
  average_rating = 4.2,
  ratings_count = 890
WHERE title = 'El amor en los tiempos del cólera';

UPDATE public.books SET 
  average_rating = 4.3,
  ratings_count = 756
WHERE title = 'La casa de los espíritus';

UPDATE public.books SET 
  average_rating = 4.1,
  ratings_count = 623
WHERE title = 'Rayuela';

UPDATE public.books SET 
  average_rating = 4.4,
  ratings_count = 542
WHERE title = 'Pedro Páramo';

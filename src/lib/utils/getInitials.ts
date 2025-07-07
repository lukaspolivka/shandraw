const getInitials = (name: string = '') => {
  const names = name.trim().split(' ').filter(Boolean);
  if (names.length === 0) return 'U';
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return ((names[0].charAt(0) ?? '') + (names[names.length - 1].charAt(0) ?? '')).toUpperCase();
};

export default getInitials;

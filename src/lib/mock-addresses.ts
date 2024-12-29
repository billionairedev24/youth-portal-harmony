export const getMockAddressSuggestions = (input: string) => {
  const mockAddresses = [
    "123 Main Street, New York, NY 10001",
    "456 Park Avenue, New York, NY 10022",
    "789 Broadway, New York, NY 10003",
    "321 Fifth Avenue, New York, NY 10016",
    "654 Madison Avenue, New York, NY 10065"
  ];

  if (!input.trim()) return [];
  
  return mockAddresses
    .filter(address => 
      address.toLowerCase().includes(input.toLowerCase())
    )
    .slice(0, 3);
};
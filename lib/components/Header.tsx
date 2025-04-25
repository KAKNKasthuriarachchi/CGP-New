

export default function Header() {
    return(
    <div className="bg-green-300 p-4 flex justify-between items-center text-black">
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact Us</a>
            <a href="#" className="hover:underline">LogIn</a>
            <a href="#" className="hover:underline">Sign Up</a>
          </div>
          <div className="flex items-center space-x-2">
            <span>👤 Hi, User</span>
          </div>
        </div>
        )
}
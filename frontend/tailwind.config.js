export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
 theme: {
  extend: {
    animation: {
      marquee: 'marquee 25s linear infinite',
    },
    keyframes: {
      marquee: {
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(-50%)' },
      },
    },
    fontFamily: {
      serif: ["'Cormorant Garamond'", 'Georgia', 'serif'],
    },
  },
},
  plugins: [],
};

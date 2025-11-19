import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import CountUp from "react-countup";

/* ─── PROPERTIES LIST ─────────────────────────────────────────────── */
const properties = [
  {
    id: "P001",
    title: "405 Lock House, Goa",
    subtitle: "Luxury villa with sea view near Baga Beach",
    priceText: "Rent | ₹8,000 / night",
    image: "/homehouse1.jpg",
  },
  {
    id: "P002",
    title: "308 Ganga Sagar, Nashik",
    subtitle: "Spacious 3BHK apartment with city view",
    priceText: "Buy | ₹1,00,000",
    image: "/homehouse2.jpg",
  },
  {
    id: "P003",
    title: "566, 3BHK House, Delhi",
    subtitle: "Modern home in the heart of the city",
    priceText: "Rent | ₹7,500 / month",
    image: "/homehouse3.jpg",
  },
];

/* ─── TESTIMONIALS LIST ───────────────────────────────────────────── */
const testimonials = [
  {
    text: "Don’t let little things stop you from moving forward. Stay focused, stay consistent, and you’ll overcome challenges.",
    image:
      "https://thumbs.dreamstime.com/b/beautiful-happy-family-standing-front-their-new-house-parnets-holding-children-keys-focus-keys-family-holding-239824741.jpg",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Palbo & Emma",
  },
  {
    text: "RoofScout made buying our first home so smooth! Highly professional and trustworthy service.",
    image:
      "data:image/webp;base64,UklGRpwlAABXRUJQVlA4IJAlAABwpACdASohAdcAPp1Amkmlo6Imq3MN6NATiWMG+OfCsxERxv9LrMpNH3/xj/ieH/mY+ozHLkvusn2/u/A/9l/l/QLyK7UYA36h/fPN//R84/tV7AfmT4hn4D/x9Md4HP2bftpxNGyD9mFg4sH3Rc47dIZ1JmFThomxx0XBq1e/4UhT7ynGJPgW0np1d91yb//urv94P2yUI/M5utBwPXYmW1OkS4VcwNCAL4jg+Wtw12D4kEiBnx6ptG5wBlsMy6GF8LTv6+4CpkGQW8kJt1OA7PR///+aPSoqyAMu4+azrNcDyNN/pe/GGJWpNrdt0n5QOppYvt7or39w2afDZJMe8yFCu80gOFTeVM4Pst63RjB8fRjY4IEwZcrbc/Kax/SHKMlHrGofCK++a9v2qXxB752MsT109oOXGebamo1YzLfQOqPH1LFWR++2efw6EtQY7Vcj3KqeeyQXn+OWohCXRPdiA+Q8E8TzvNjxDZXxRR2BxS8Bpzrlk+f2+Q2ijsOfh71tM8OBD/B/0ym//++IPYMraAD5kz4TqZLRO9OCn9uBBPmUzhd72VmHAAumULcE1kmzIBovNXbOPNU39ep0u7EQufeXxz07Sd97+dyroEO2v39/pXwIP/xBkW7/+5C9TDFXxoYgz+EWnE4bjUNoVRzfWJ3oJK8me9XzK2iLmn7i4Xecvmo4F9BiHXjAnjMii+qHDULljCvm8MTkz429YOQiXoGRUq5S/GyKS5At9ePb/+dQo19m2smubPrq7uz7Ei0CJdv1jTs/pCbwvcmWqFj/0kXrhTC60/uhq50kWWridBFc0fU9WHMiTK0qhDImcoFIgo2kpeVcoYYPIzFPIDi8lKCCmreHzwwCv+ud3IpCLPSFKd/6Gl3xTY3SI1S+GX6bnwOla8upi0FtNoLII+076ybmbPgycuLkS+n3NlCUT1M+20ohePkEiwex5yO6MO0rbxhxnHpk93bz+QyL2dycGof5vTVjqvf8mi2X3KcwUJuvWjodkTKd+TUyxvlVpA0SoD/4CCBMtD6deU/t0gv+8pZ9u9Lz+MzSWCArisNxnfiGzbfrI6p/Nf4+fnSMygQ00C6T6gEDBOlVAl2P4yIUP0dRHARmWO7VKNAgaf87KdSyMP0wgpNj7SRLeUogQJ4ZtPHbbjBGBYLVWjg6Uez2KuMsL/TAXUan4Sctk675DhxVHOxnKwgC28reOSTMGiooay5Muw3h61ya/52/o30cx7tqjLH0DfrJfIMCBE1ozyjcTAVMKULldscJdqIEFsolnmfuat+LovnafPg2lC/IgC90o8qA3qKuuRcfx9u/JPtwsyseSe/FVUayBvfcVUgXgd+Ahg5Q8Ptg72ufRK8KkLxri6Id9btj9am4FHlm704IMQbFZtfIUBl0anYEd7TOKgjsqgGuSC8UUO+FAnrCkRZPd7P/iLh8ihe8jvBzpPJXS8AqcoSpnEu00dDLyTeLa4MAH+6rD8BFebGdRAEjFjZ5vNoQaD+C0zwMZ+wbv5FxQGGLMehSj7zj091beUoLQxo5vEo2s8LweErTLQr4H+uLrdcGf7s5riryNi4h7n2iz8+bUQ9H+R/p40cmj+7P5ClU+ALP+HAKxtMIEPGK+kxQbw3p4efn8+U0zR3dfbA1AK+Jl/vbRH/pVto+/bYcMOw+FSvf3Yy20liIhtTCfIz3Yycz3C6GU9KXtLBGk6CN9fFFxrTkWPMjWL0X943o13uizm0HB2yEyZcEwGWjBh1EVFPTwZP4AP71UWtroKt+1PUnfesP+tvW3op4YF39qeZRVXQ6BMxspjlBp1GIyhNKl2LMWSpdXcrX9vjn1LMSZni9kzX3XQvg74k7M7CJf6890XCHrvTF9P8QnNRBpMYvf/5tLb/yyRwnTVRZ0tP7gjFlYVtdd4XfQ0693/q9ENVQBoCuupSqYtZRt6T/bf5L+UWUUPR3T5B+GjfY9YKjl5h3wt7g99URzZrzv1EKCJ2+pnt2JJbQydUWXkn1kM0DeV6k1GkLo/SLZq3mlNPOC/55HYvcozN+3+11tyb/TvFfPcd/XWMljhZBp4xBN1uEXF6wBB4unxCByvkf9dfKBiMsJ4andLwSwHBx0mbhD7HS+iN70JCPxZxlj4Y+gGTAuiXffo5EeQekE4FI8kAQNsQbCJnH//6F+n2qO3wPrqOSA8LBC2IuyOXbBDMNfgK+5R0rsfPV62dlyCw0J9r9ckWCWaW5PWyZHFeyV5zajhnXyg4+waCUwj8pUbtCszie7DMEjtYowvpwO8TLXFupzK3E8upXZw1lMFxx2P23FkUXzYogzXLeFLQVoCCVzNm3gIKEhAZOxyAEzBfqd/KKPcZbL2jEacwH2akRYEWVQzRjQbFoc+6yPg0mGsae8jHSWZm1GmY4vU7VPPQ87KQUBUEJBdKg17JobCKeUnZIIJ5AGkvcjxxM8ZbBQYALr8sWur97YzeBwt9QZc0eQ2KJZPS7RBqT+Ois7x1faJCTkc0ehR0mKUFVjFHshCxMY1Y2AsKs+mj+pbo9fvAEp6xWkDbv68wFdRx9II15GyoeINZcmfeGtHk/BoZIzpRTpJ91m84/PU24yn87Xl+oTwZpgjR+W98IGiFtWmmtMnqkBcg0l11oc78Q9dIWzOixkcGyIcwFopYBm9JZD4v08CVlUgntM/siwEgRWkoy/0sw3pKFmIJe7ZVd+MkDmEp7CdCE9ao5z7+czdLFiv6cDSuXklWyrY0edZS6ew60rxT8WJMPSyCsRCxYB0V1WKfwU6DZBsFJL8aHgd0IKcLZO8XMgF+Uf1eUmVn0Wkci+1rJCyQZqcgTbnZYuWnAHNfk8/76qx6jhIZWYZBOO3qp+H9EjYFMS+ttzvyhtxfHC0qP9QiJK22FPKR8MardkePd3k1QYBRpago3BpxenWLtKamIsT8zmTFt27N+POdAZ3FuDdQFYgbRGaoW75jheZE08F1shz6ZP/FAdbgwgtceC3HWRY+uo5aG2G1IJuVSFG9QWOQBr6UOZNgAQqilwwZGYucqY79GYsGOcrtErKaHq89Dj0MYtY3xLqjS0yCSCyYb6MTSEwXlKoSLQ2qZf2o135daEFy09IgRwirEONv5ehYsPCiy0KdiqbkkI05MaNvHh82cR2jWuLKuBE4UoyEUJjlMXFzMnmamlr13MrWKE9ztIm8TMUviT64GdidLZ5KPmeKJPp4iWHU4p13eTUrPtQpq/wfUzKhzvfrKBCDOxCgwxa5vlgUbFB4ZfDyNVWcWaZKxRiJmn61ju722md5IusSFMPrDD3iBUsqyj5srhQhXEX8r06adWtHFCBGhuiXCYFmy4gBN6DI2HOjR07vs9TrNBGSCC//XNRtGdrroepq8+oLqvJy5+7W+YOf/X0Q0avj57XD2Yr4wdSvq8SAQ0F51jG2EdTKKpeQMOD3zXK4KOHYzzXkGcCTE+mWYQ9utXk3TR3kUKIIPcif8dmlA16Ne8ScuTFHvZR9u0V2wVE7jPg3SaFOHLqVOQyHKnmS/6GCAOOk/iELPHOuiUp2rkUiIPE8EZZw52UctUVEETeM7V8nc7ZgAbCBFPY+LthrnjvZGfLSZAsdfAZD3NlQwwe5PKcAVu7Vl6k39lQt0lbxyDHDTEjqsldnUNVTn6cEjYDP+xuAqc1f1fYR++7Zj+cq+kmS2AH5gBzHGPFnicVNg0jopdMZAg1g3S86oc3H/EdFnDSrYQAkThsmqB1CdFlOaFmfZjqjVKYWWwXF1BExTc+lomnLpPXOMh8Ep39jLEsHbymW+gwZQhoUHA5Ph5SP/AzRcg99S2J3Kc+2edQdb+YhQGIxiEMbo3/vLllPYV7kS0SoK2KbQSCovmBusgUBXogYXMFTNc/K9p8E/maUtkx+JwaBHCm4yNzzREQA4UEXysqlpnfv+eCLQrWS7tC6k0QnynSbbHTIwLSwzZcXDlvOmDES6H6yx2wPgKb4QBFmdgcGRl/2urhK36pAv3Vknm6e5bysyrB7m1uwLSE9DEyu9W0arVFFDpyqPUZapcFaHAFqELyYhxxzgrOatslN4BL/tkpWFWn4G+sNAkGegyvpjdnPsNL0qqsr09k/rF12anmiON5sdNOjsuH9xGfLXcdKaCMCnnsOEOoCRK5oREs3NoApNyOuD8MGoViU7dOvifNgdTLWhV59jR+6nI2UsTjneTOsMlac64FfXgmJm9VWIN4biWsrflYycFatARRq/kpZtI8lRQUN45bWgj2690mfiJEX7kfg9PgTxa1pP97G9EyY9FSJi53X/0qsFSDeFJO3RMjAF5yBBQJqmGf90qFsSnng5TMyDBYMtBOh97brJaTYZodv10WEhr7SJ8NHGrC/4qeXcQ6ilMbV4PjBm1BBy9uDDLlm4BcjD5PQKYUTyKLMYi41zjKE5N7FkkrXbvY5SnrS5nyI8K3Mxzq9vP/bMl5sVfrd0aJisJO/qVCsgZVDPN6b4f95BmNWOTv9uZrVqy3TWVnORpa4J/NAmvW5oi+QXgIQccu8V+FSbwTtghUoiAy7QsTWu2fTv/I9E1m0sk2GXPSTHU4XrEHijliNSFUsXahB8QrCe15DAAl7aq8vrpiQZ9k2RtD28zZNV44BC8Vz6U+4ZQSEjDDH95FGlCwnNKIx/Tr1e+3nVnDlfx/kZxeFfe3BOu+m02Tb2Nx+ntTQ6QRTYA7XPE7Bb4VJJca+UGnmhcawn06jSzx00HjDPBubOT5QDvv/p6Tb5esTAzAuCEh7n95CzyA0SJvv3YEX9/3zvPGVgbATo9Lwh2IAv1zVBhN5l/T6E1VqOC4kBOGqwmjnOX1Ft2EWecU1cVnIAtIzf7qiCEKe7C+FJ/LPJtqyA0RYZF+O9rcEj62h07fdgUmdTIjl9l7G9gDMDC6eylm9axjFeGFa/bbvqAnZMPzmpqAjaGkF1AnwuozRsgVPKB8RPvt+8r4m8nFTslWXYP+bYj69wfW1ZQjrcefhlPF3iJg9k7dzfjfiysHQa+tV2n7ejayRINSWn4oSKxFOIv/WkPGAZuMSak66n76e9s8j7JGRvjOheLit/1w/4UZkhsx1RNszaSlJW6rnPYOM0ZZ2JbviJYPsQgLFVA2Dwgy5atlnI2NFGyXUTeflJeO/w7Qg3werLTrmD22bx8mGlasYgvYGLx5fC1qe3fkQi0NsqFmHB7o2bv5KiwzOH8TLTk4/M3K/jwdKRysvLTnM18kN9I57YDWIZEKP4TILaoVIr+/EIgsnva2Duf8DfkaOOe9sL1Uoq+zh0/QHYMPpIpGan0BHIREN6Z67SETT7jsqCVMH0Dm2MmGw4wRtOnVaPkO4BLxRzR66PgiYv6wO3oNbCDxA/H4vpo6mq0OQXQdTuDx1Et+G9hJ2rqGr5oTRiIxQpjeQGdiKcErSzGrnT5GGeBVZ9PI0d5uHdGUTqexgt67hUMfNqyUBdEqCvR8NxPAjP6zRlGgi3Q1e+s54BFHnNyWPTR4wOX5Px2M4wMXnxGLKGAWS+mNiT/dvqt0rsyKygspJfTZQJ2hIHuzuNxpFAJbbynmCOI7WKwDohCK4Wzf/HxqqAYs8goAEBcO3trShqlwz8LEz/KLCOeGQfAL/yddyWB5rr4zdnZbDK/G4v1gHviL+m3WqFwqAd8hxT+vzbPDKWY3fQ2j0/EwCeGP0lWXT7RynhXgAB2gAk7aUmHQ4hvTg0BdcJf4/Q4/KxZna80wQxzOwlIgl2xvYPEzVx+wj5I8iSKO0jzUrl9cRCFs2cMypS63S13FVGTkjjnjGs/J+BazXpUjxQeqG/440SPob2XZjveveHtyrmTzPVFVNclx577be910SM+0ju5GCwIoa9TY8gJchvgf+dcshCxA62EYmirQRVXs6hEOqzoocHfkpjHTwKJQRgwlSG2KJqPShPaCznRG5cER+XawmuzugsISofJzK2eamrDKmrs7su5gyweihDh8PYK/OGB1yi6kp/gjIZyzzLMgtJ/OSXTzsApKVVLhBg1kS657Jc6q/nc7ycf1K9gek/TEox1xJGS4QBOWKZPCPbxRy2ErTottKlSBlhAhWNvhd5xAL582pIhB+xFok8bhqoAwIy1yZ5Z8MbdOfxLhw1HtY5624nOBQrzagGLM23WPkP1kNqFi7e9o0DnMsL6XEyJnWn+ebbT6XWwc7FEToiHSzGWX3CZ+CwiHmmdbYCa3Nzx2EMmT4uzmkDJmHRN4lcvr0sAMzdI9ekzuPHfCaYwvAAA9SWo2U2n4iDmckR87JkByqg+sT/iaQUHm/J3e8s8ea4RAu8fQmi9bXnHwRNHiyuXcPrWmIJPF785W4gX03mtZmYJu7VPvXvP2XFeo7J6jpwsDMo/5G7vvLKUtxG1gAMaW3srDccUYoJdZ2ECvsJ749EyUzlKYWFMZvbKJW2xJMjFye+lDreBm8CSY5NnXTOb+mrywLg+Wu3xqtKfYPZbAdOy5/d/Dg/+ONlU7PjDXtKzGrPnpA3pGgw7SUzj+psbXKPUIV1zulYJS55bD3wB8dfvjjIxqdhNSBMKEve/uOrTJbXbSVqmFdmIAmWXuNVsmMZToL6dqQBH4639R1URsUyRd1jfbNPmONZPN+nwACKKvoQm09ICeVoGPUNl0a9pzdzsCvBSERZUaFg9CegcLx9FAZ+Awhy7nxI8dhArvSdw+aKoTX8DDGbHZZryu/bQbu8+4drCIk2SnYz+b1uQkDdDbMOR4GNDzihZ5Oxd+QKZfXcrXUq4ojazbogP0qkj7UjfFdR0uDq4V+aX2qFGxxNtbKS35k7oY4v2lOMjNzxvA+dZheduv4YLqG4mInHOVZAPnNxxre4xHjFMUDTKkLWiMiOl8KpB8ImYPi3LIK7ipOOpU6IhgohWxWw+y7ahPwR23Bxh6ZoAsTKFvPeIY9k2WZK2RvPhKU59+SFm3f/2jFuiuF4YsfzD0zOBm47jwJDkiAZ9vJMo0QPR+ZELUxEJTRS638SlPBWXGDly2O48V3dHeEouJABVIXiJcOgFesRpOafHJud/Z0liVRfKN1OsD89YVewEpRlzdwWg2Df52tFEO5aqcbohDdrWS54D9LQvHd+GPt9vqSVoRXmZA03PCXpXe034Y4DOebdRSYFHn2jHjSyWHxYXIa3Z4wFo5PcqxXMF1LN1FRFE/SpIGPNfqZNDzj0JdyzV+nHDVNvmM6sKO2UwFDdNAG0pKh7Ztf2UuSxB6d+nTZvymVJeIHUHd9LalatPwErmCDeszP6SZyrPxdfpGEsrezqxNT980vh4eImEwZNrs2xGnANUKReY+bn43RKCHAh76L62EUyx1urIkWdQV0Ce96uFwpBoJZZb7frQaJ2sU7DH133bw95lzEXTlPzj/xgPMfMkN6o2037m8/Ac42naW1AGIO0CYCk8m8OlaUQwS3HnhUZVtqUqNKwhs5ugXMoA0yZIv66SmrGIfyxsX2baBDjqnJwZs1bYRs94Hgt1vyaovHTav2EjDyXygNcsm0Vcp34WChgYBKQjF+W/ycurNAmPzViHNu/AwHmbbirT57zxPAFRpvh3Lvj8YOnhlPChPh/NRmalXItVQ43tMiAI3dO6bpLJCplaBtoKuZP0FZetM6MEtrNIj85cIn0BNNAv1Vj7O1CdQ9Y4Ie+PEzJjZoRLwnt9Exk3DdVH1PNI0NMtkKJzrQ5/fjLZv9pQ76Fmq6PTqmyKZImPR6da8ORLi/2fXmlnVZhJco/tCPGUSgXt5b1jvIfnoUBDHUIoXm+tdzKWCzjLCijD6PFQfb4XY/xt6YJ/IfPmxnlrLJSb0NgvPIYBlIdQvtKM1gQuLJlZbSRDDsCFy7PAKYFHbfyVRg+E3SPQxaLOXO1OgueKnY4nCtJl0aJFoKEh2PsU8bNENC1ZduYUioG1t8nXnTmqBPeBe0P4NUtdWIt54/KfCJjqyDoR97sZ+IiU6WyP98eW83CpLorA37dFl2Y0gguWjSW2WL2t6DAQd0yOWBy1JmYT0Bhxd/Yxc0M7O17cUu9+ydQDmdb69AnNgnVhAfasseeo9+BsGmylyoPwJSIdmGSNmCDPlE/bPFrat4HH1I6GdBB47x6VxNUwtVgwz2ri5LCSWz57XMn6bHqL1MHcZH0q1ProkBQIAK4d+WUOz1VobgajXlq9pVnk7LquqIwYl6OBCjEsQWdN9+EsRmwA5ZuVLYrTQjitQnYJlKWgp+7y7Ft0YdaOnWVFDY+0QMs3FEjf9CSb8FYQ/m81YjSsZQCFVyK5XoOihDfWWtRUMYuodMIUXXFpUj3fY/k9T+SI6+ZM6n6EN2xLvouNFDVPsnwht2yKvlyqb1dPsEbfyy4ixCpla03gq9+vd+ZADNDLTXsA1er+Dwz32SU2OtpdOTq7ghKZhFkdZlzCQ/bYg1/+FZfTkuhkOidUzsS0Tp8DKSZ+juGdFbVhpbEL3welvk1bZoXOK+4wZTYBhTznbruQ+c4UfKbgMVjb+DTfwh3/dd64HGsklRfHWbdZ5fTLbIxZ7LwAhDNHGvh/7hh3NDOG76hxSXazd987LzLIZXCxYO/CgfXe55YwbNwP3xZLEFF39Tu309jPNdY0+6DRfVG5bj1aJRVtRTDyzgCDu/VWMwFsBNA8zDG8n741vViiHsrXc1+WuArLkWtCoqKk3VL9rzQZ71PrkJduLQMV7HVZEwXwbC2HwKOe9VHrXxjno4oy7ZCsr83wJWP/Liyu6hA8rbEqm7JXJXMC7VHtQyfibzQnF+v3Fqgvi3g621YVFGCIYxl12xnfhtwTtOq+e5ydadZD5+cMD46wGACDWwBIZL5ZfLXyt0NF5UQU5UpWVjp/1JvXI724ncg+zdmc5/47fzXWJb10oZJ2v51alj4ZrufeixncLaIIHOca2RUmPGPzKZUYBSyFXH83eXld3+uFmA9HuAVRO1/Run+X40JOYyRWKQkatkD00DgDHVZVZ6Y3Unwswf0avHIaBGgsSq/AvLsu1wA7NpN2FUpr9229GVjboVgKX9opC3sCMiIDLjhTAuTfyKvWmwPAkC3BzYzqTKnMFQ5ZlD6atKGa+C3PeKQ43XRnfDWwD+WV7ijYu/biV8kKYUJfA/cKwBheccHefPDWJMDsM2NvU7wE7olVxDHwTkBctoHHFXkWRrXwEyWbQY8+K3QXqFMYYTVQPhu95I82tMZk2dotYnPEqUDXAy3Ea8AUxCdC9XoQtzBEx5Z2z/zE8iCnvy5/mW+4I8WeJYzozHX58wY+zUlzviy4D1eNQJrs1ntVv6KlB/EKcqrqMwz9XmG+6ZP6SQEl9UaNpPflMI1jdWB04pYntT5jDm85aKjfc/Etq5RHX/UTWv855/9EQn/Wgog3BXuyZvg+5iq+s6WUcX9NRWyRrhKd7yencZJHNFsp5bmHScNe7NfsZ+io8EXHO0FHbcy8mxbiMAg/GaFHB5vtW1yD888JSdo1N/rPCZRr8bJbJq2K9w+GeUlC3pc2FJF5S0otYWsSymgCpMPEUIoGVFYdJ+yjNE6t0Z1+iCcDPy896lkAS3pdfARbVVRYwEewtvbl0qAZQWPnF0MqwnnDlAGUNL4/2YuVLFnip2GS5hGx0cL7wS4JyO1T3pV4Htruerpso0qaZ45NVC1tToKeKDlNNeR5mj8fEFYah0GNnYWWgL0BaG0f4SOuWL1t1lOxtYMx3vTg3QEBQZUF0hM0Of0MUN8p6DY0tcQG5nqBj2ioDWosuqI9AeiQS8zhcjAZImt3n++7u+f+pKWg24Pm0TbsqJYIN8KInoPLvwt2tvf73b8hc3BGLVT9kid9waiRV3fw0IBMWlYZb4eKGThZYEaDCAwkNxSTiAl2GYl4rChWqRh1efZkburWc4DR/YhMMSbHUghX94SELXwlyqSGxU7P05pjsvwgtWYxVjreIhWQp8ajVW/n6AaJWDnyxTTWDNiX+0KtOktP0n6O3ehwhCfBsYt2ciZv+g5rKi1RHCGr1OrAcnAsQTxtrr+oHujDsOWj5KFX/j7OUFPxgf72f9r6hI0ejIoNZDaCE89iRj53Icf02LSAjo4zcsrD+fkWBRc4GWMAp7zqNRA2XZGxqZbvmzSXLnSa/d3x0ETDTnXwy3o92vS/ZbpZIcuR7iQj+JMxvrgsDXY6e3kWC0562nCgij8EcxU1Yk8GN2ge4oOUIy894jeD1v2rrfdy9c6EsRy6oWqMUG22ojXjAgWIFrFImxMO54BYPRpcMO9Mxu7+J9/0qcNuR7fKW1qei9/OwVedPwFMCW2KTLtFAtFoHZmGDUdy6LRKAGOXgJ8doMlpqwo2O1C+F9F1z2YmAp5rsN+7ciEvfsbjRrStWpfyhCBgiRoHIPZFlU8+qb19d73ZPh5zZugQmfqeifyvTUvWDrOr7qR4SP+VeNw4yfF1F0oWJhDQvroQdUEce3pKrlBnlEdzDRzJxXFGS0HuMZBxkkHhDlE2TYAvIeoZZCE4MlWPXJqnNl2eBKYVJaRCvxDtIWlsEnYSQO4ywknuxqjiywwpIaTkh1Fws3GWp4OkgKeBa26EDOziIge+rtY9N0FlTOFKTjsdGigSrw0UKIOAuSyHdfXq3PmoUO/7n7+oRei8L0dD2jacjT7APBEApVIh7Yv0H6xbhkAkI55rP3hE7vv2oBg+HYO+Wgvg5Qr51Sqgxvs7E6rgoel+3TGsOaVSe8Z5odiUSn1zrdiZtep/Iwx3CUZxUpCoTNhs5O4sLtnD/cRHwTxbQLP1FNlq5+NheAh+A3kTrxLT0IEYgJtpToaVVVfuwqZYSYytGXc4coiUFoFWcQxKE/t1YvHzEgGwYgLEewLz3uiRT3cwZa2vTKNj3Gg1Cw8V6AObH/AN9fyskFLSqq1WHOPf+YmoxO5htE1+kVRhhZvgdViIrT+BQSbNb7zjr492KpLUYxObr5pIP3aJQOoxJdcUMp+h9s5li0KWdrmEdt0mGdsm3k3rc/TzfVN2z2fO1jPk4APtlBKj4OLUH66B/BWG+QX1ebX5hyveoM8fP1eM8VvulEggInzk2v9kqsK1NUFjBoUEmSAJoRUxa5FIpiUUzalyPNDdw/FG3lhbXDyMsZ9pa0dg/yzZr+hdTwtIHrJFIQLaUzbHE3AP701+zpmt3LUk3pRxDrxmpka/dtVB7FUm5lsvogJ+0CsZxb35HakiqQCL5rSzga7zK+SpRtoPGNAnse6tJ2MieYDG7ZJ2cKaTDZ3ekY/fCxrQJYbSQEqaqMlNpvIm9PcsxSePdE6+y8Z2s7x1lCr/y+JZzegMdYnlTBoEnsSezbOFinTDZaqGnemZsCmLFzdg65ZNn0Zy6v9eln74NmCk9dSD13jl6cuhT+mnfiQSgaVrm44Ldf9mVqZSEla+gvqkJWyAR03HdFzxO7Q4gPUZeHpdZPg0+qJ8nUK2kEK4tkIPUZauKjym20+M6CZ3puniZy/3BiNO30FJD21kP/cCKd3f2Rf91g21534i2gsgPuaIJFMG642SaPpYJ+wXpcGVAn+c9lmOGU+07ZIzqajS7rnCz/dsAKMW2rhp/ZfiImyqtQMUIKWdc0gfLbRLoklpBKrOdHMFFoDCFw6W4Gn/+i0A5ZbzhMeNYJgFPIBASUf7TylizdqUF/3iSbhSr5TSoiKfnKx1fIibWrjlHXEyYUxm0OAxFHJLhnk1dvehVOBG2ovYlYg2ZeSJ9wsqe5WT97KSVoEQW0kdeKM29rfgWtcvl3YEiuxMpycvrOCBed+c3vhIqb2dUG41klUrFOKi5KaN13wBwy7pmrSu7rQa9Qyh6I2qb5vy8SJqxmWGzh34sfWY0N7U3THqYtHMkT+XYmJPUC4IeeCAA2nz8qOqx7CgaPTV0a+urB+MqBickr+AGIjEwevkEIAfRixqfFvzxguyokYJ/JWzJOTl8EdLlVDuDsUWEZtEoDFOzIZoa+/pL30X9AWusPaeYelPyDDO2eaMDljsRJkIIxOtQurnnhsKaGStFfs6IbCwFJwASgfNgyo6PsQV0tCGWMX78g/TiVCvFpZ0bC+3KG7+/iC5EK35R28LkwEZRNwZZwr3hwDKOkF7toQxVlWC01kVaWJApRR9SLTLMrPcHSSDYdOQi6wxjkeu57Kn8diptf7a0xb3aR4hA6EKhWAQWHxeEZIrjst8Z77dS/QAK9iUWUMS9ixwTHSExFtMBuZqfABUvRc9+os0W8dSN1c3XH8/qgP/80PnINWvAGNTo7CIP2JCqksn3JN1K+Cr+Dj02kYdZb9j4yWdTONX3FNfAVAwVj5wT6E6QsrYZvgzl81VXOVWqUptJb5HbS7F89ykNvN+Cmasd5zhNcNzzx6ho9kfJHUF2qW0O2pt4Hc2qFDrEiE8whEq4VC69f6IqEcwpSnsmXDg3Vcr8UnxyF12mCkYJinhCfskRdDLphiAM9O+jk4Qjh5Cg2dlNl/amZtF1eDT6JPkNdxx4NZh0sMg7Vv9igfWZv7u5NzZ7W8StMOcp2IdTYPCFA7B21GAg/qFkvKc/lfOAvxekIGUtEAj19wFZ+pkNcwJeUdtZZU9pJErwxEGE+Hur/Xle8MCBI/DNCmejdhlff+AS922HKJzsphYKERH1t5E8X2rgKT0W4W7uv6BjJj248J7KIzkGYeKmSoNdflsVELgYzsVW46XVlilUMxLC0x+aGTi+mFxCGMVWOqkQZQPQhiZZsM/SvVckUPBirx8krdlXiOESAemHXIEHUHIwBNO/dNimyBlWhHZloLlqn0ggY0FCpLdMVhXLNAYeQwcl88IdpZyTw8ILlcSKeAOBm1fGHd4P0YojCwNdtKXGe83EymGpuMyiE352OCo/3JdiyMEKI+2AAA",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Riya & Manish",
  },
  {
    text: "The rental process was simple and quick. Found the perfect home in just 2 days!",
    image:
      "https://th.bing.com/th/id/OIP.a1AU_Nm4QhM6jdkD5pxkmwHaEJ?w=294&h=183&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    name: "Sagar Verma",
  },
];

export default function Home() {
  const [counters, setCounters] = useState({ homes: 0, cities: 0, buyers: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);

  /* COUNTERS ANIMATION */
  useEffect(() => {
    setCounters({ homes: 5000, cities: 120, buyers: 200 });
  }, []);

  /* AUTO SLIDER */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Navbar />

      {/* ─── HERO ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-black py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Your{" "}
              <span className="text-blue-600 dark:text-teal-400">
                Property
              </span>{" "}
              Companion.
            </h1>

            <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg max-w-xl">
              Rent • Sell • Purchase — all at your fingertips. RoofScout
              simplifies property discovery and management with seamless UX.
            </p>

          <Link to="/login">
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-lg font-semibold shadow-md transition">
                Get Started — Free
              </button>
            </div>
            </Link>

            <p className="mt-4 italic text-gray-600 dark:text-gray-400">
              "Simplifying property, one click at a time."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <img
              src="/newhomeproperty.png"
              alt="Property showcase"
              className="rounded-2xl shadow-2xl w-full max-w-lg object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── VIDEO ─────────────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden relative shadow-lg">
          <video
            className="w-full h-[60vh] object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/RSvideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <h2 className="text-white text-3xl md:text-4xl font-bold text-center">
              Discover homes with immersive tours
            </h2>
          </div>
        </div>
      </section>

      {/* ─── COUNTERS ───────────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[["Homes Provided", counters.homes], ["Cities Covered", counters.cities], ["Happy Buyers", counters.buyers]].map(
            ([label, val], i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="rounded-2xl p-8 shadow bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
              >
                <div className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                  <CountUp end={val} duration={2.5} separator="," />+
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-semibold mt-2">
                  {label}
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* ─── SERVICES ───────────────────────────────────── */}
      
<section
  className="p-10 bg-cover bg-center rounded-lg text-white"
  style={{ backgroundImage: "url('/service.jpg')" }}
>
  {/* The container that was previously the opaque black box is now removed or simplified */}
  <div className="p-4">
    <h3 className="text-yellow-400 text-3xl font-bold italic mb-8 text-center tracking-wide text-shadow-lg">
      {/* Added text-shadow-lg to the h3 for better readability on busy background */}
      Our Services
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[
        {
          title: "Easy Buying Process",
          desc: "Find verified homes with transparent pricing and easy EMI options.",
        },
        {
          title: "Easy Rental Process",
          desc: "Hassle-free renting with verified landlords and secure agreements.",
        },
        {
          title: "Easy Selling Process",
          desc: "Reach thousands of buyers with optimized listings and expert support.",
        },
      ].map((s) => (
        <div
          key={s.title}
          // The fix is primarily here: using a transparent background with backdrop-blur
          className="bg-white/30 dark:bg-gray-900/40 backdrop-blur-md text-black dark:text-white p-6 rounded-xl shadow-2xl hover:scale-[1.03] transition-transform duration-300 border border-white/20"
        >
          <h3 className="text-2xl font-bold mb-3 text-white">
            {/* Made title white for better contrast against the card background */}
            {s.title}
          </h3>
          <p className="text-white">
            {/* Ensured the body text is also white for contrast */}
            {s.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ─── PROPERTIES ─────────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold italic">Our Properties</h2>

            <Link
              to="/allproperties"
              className="text-blue-700 dark:text-blue-400 font-semibold underline"
            >
              See All →
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            {properties.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.03 }}
                className="w-[350px] h-[500px] rounded-xl shadow-lg flex flex-col justify-end text-white font-bold text-xl relative transition-transform duration-300"
                style={{
                  backgroundImage: `url(${p.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="bg-black/50 p-4 rounded-b-xl">
                  <span className="font-semibold">{p.title}</span>
                  <span className="block text-sm font-normal">{p.subtitle}</span>

                  <div className="border-2 border-blue-600 rounded-xl px-4 py-1 w-fit bg-white text-green-700 mt-2">
                    {p.priceText}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL SLIDER ─────────────────────────── */}
      <section className="py-16 px-8 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <h2 className="text-blue-600 dark:text-teal-400 text-3xl font-extrabold mb-12 text-center tracking-wide">
          TESTIMONIALS
        </h2>

        <div className="relative overflow-hidden max-w-6xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={testimonials[currentIndex].image}
              alt="Happy Family"
              className="rounded-xl shadow-xl w-full object-cover h-[350px]"
            />

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-6"
            >
              <p className="italic text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="flex items-center gap-4 mt-6">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt="Client"
                  className="w-12 h-12 rounded-full shadow-md border"
                />
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                  {testimonials[currentIndex].name}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}